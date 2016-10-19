package com.ittumi.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.ProtocolException;
import java.net.URI;
import java.net.URL;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CustomProxyServlet
extends HttpServlet {
    private static final long serialVersionUID = 1220182758271730914L;
    private static final int IO_BUFFER_SIZE = 4096;
    private static final String PARAM_REMOTE_LOCATION = "com.sap.ui5.proxy.REMOTE_LOCATION";
    private Logger log;
    private String[] BLOCKED_REQUEST_HEADERS = new String[]{"host", "referer"};
    private Authenticator origAuthenticator = null;
    private String baseUri = null;

    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        this.log = Logger.getLogger(CustomProxyServlet.class.getName());
        try {
            Field f = Authenticator.class.getDeclaredField("theAuthenticator");
            boolean isAccessible = f.isAccessible();
            f.setAccessible(true);
            this.origAuthenticator = (Authenticator)f.get(null);
            f.setAccessible(isAccessible);
        }
        catch (Exception ex) {
            this.origAuthenticator = null;
        }
        try {
            this.baseUri = System.getProperty("com.sap.ui5.proxy.REMOTE_LOCATION", servletConfig.getInitParameter("com.sap.ui5.proxy.REMOTE_LOCATION"));
            if (this.baseUri == null) {
                this.baseUri = servletConfig.getServletContext().getInitParameter("com.sap.ui5.proxy.REMOTE_LOCATION");
            }
            if (this.baseUri != null) {
                URI.create(this.baseUri);
            }
        }
        catch (IllegalArgumentException ex) {
            this.log.log(Level.SEVERE, "URI in context parameter com.sap.ui5.proxy.REMOTE_LOCATION is not valid!", ex);
            this.baseUri = null;
        }
    }

    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        boolean bIsRemoteAddrLocal;
        InetAddress localAddr = InetAddress.getByName(request.getLocalAddr());
        InetAddress remoteAddr = InetAddress.getByName(request.getRemoteAddr());
        boolean bIsLocalAddrLocal = localAddr.isLinkLocalAddress() || localAddr.isAnyLocalAddress() || localAddr.isLoopbackAddress();
        boolean bl = bIsRemoteAddrLocal = remoteAddr.isLinkLocalAddress() || remoteAddr.isAnyLocalAddress() || remoteAddr.isLoopbackAddress();
//        if (!bIsLocalAddrLocal || !bIsRemoteAddrLocal) {
//            response.sendError(500, "Only allowed for local testing!");
//            return;
//        }
        String method = request.getMethod();
        String pathInfo = request.getRequestURI().substring(request.getContextPath().length() + request.getServletPath().length());
        String queryString = request.getQueryString();
        StringBuffer infoLog = new StringBuffer();
        infoLog.append(method).append(" ").append(request.getRequestURL());
        String targetUriString = null;
        if (pathInfo.indexOf("/") != -1) {
            if (this.baseUri != null) {
                targetUriString = this.baseUri;
                targetUriString = targetUriString + pathInfo;
            } else {
                targetUriString = pathInfo.substring(1, pathInfo.indexOf("/", 1));
                targetUriString = targetUriString + "://";
                targetUriString = targetUriString + pathInfo.substring(pathInfo.indexOf("/", 1) + 1);
            }
            targetUriString = targetUriString.replace(" ", "%20");
            if (queryString != null && !queryString.isEmpty()) {
                targetUriString = targetUriString + "?";
                targetUriString = targetUriString + queryString;
            }
        }
        if (targetUriString != null) {
            URL targetUrl = new URL(targetUriString);
            infoLog.append("\n").append("  - target: ").append(targetUrl.toString());
            HttpURLConnection conn = (HttpURLConnection)new URL(targetUriString).openConnection();
            conn.setRequestMethod(method);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            infoLog.append("\n").append("  - request headers:");
            List<String> blockedHeaders = Arrays.asList(this.BLOCKED_REQUEST_HEADERS);
            Enumeration e = request.getHeaderNames();
            while (e.hasMoreElements()) {
                String headerName = e.nextElement().toString();
                if (blockedHeaders.contains(headerName.toLowerCase())) continue;
                conn.setRequestProperty(headerName, request.getHeader(headerName));
                infoLog.append("\n").append("    => ").append(headerName).append(": ").append(request.getHeader(headerName));
            }
            String host = request.getHeader("host");
            if (host != null) {
                if (targetUrl.getPort() > -1) {
                    conn.setRequestProperty("host", targetUrl.getHost() + ":" + targetUrl.getPort());
                } else {
                    conn.setRequestProperty("host", targetUrl.getHost());
                }
            }
            conn.connect();
            if ("POST".equals(method) || "PUT".equals(method)) {
                CustomProxyServlet.pipe((InputStream)request.getInputStream(), conn.getOutputStream());
            }
            if ("DELETE".equals(method) && request.getContentLength() > 0) {
                try {
                    CustomProxyServlet.pipe((InputStream)request.getInputStream(), conn.getOutputStream());
                }
                catch (ProtocolException ex) {
                    response.sendError(500, "The HttpUrlConnection used by the SimpleProxyServlet doesn't allow to send content with the HTTP method DELETE. Due to spec having content for DELETE methods is possible but the default implementation of the HttpUrlConnection from SUN doesn't allow this!");
                    return;
                }
            }
            if (this.origAuthenticator == null) {
                response.setStatus(conn.getResponseCode());
            } else {
                Authenticator ex = this.origAuthenticator;
                synchronized (ex) {
                    Authenticator.setDefault(null);
                    response.setStatus(conn.getResponseCode());
                    Authenticator.setDefault(this.origAuthenticator);
                }
            }
            infoLog.append("\n").append(" - response-status: ").append(conn.getResponseCode());
            infoLog.append("\n").append("  - response headers:");
            for (Map.Entry<String, List<String>> mapEntry : conn.getHeaderFields().entrySet()) {
                List<String> values;
                String name = mapEntry.getKey();
                if (name == null || (values = mapEntry.getValue()) == null) continue;
                Iterator<String> i$ = values.iterator();
                while (i$.hasNext()) {
                    String value = i$.next();
                    if (value != null && "set-cookie".equalsIgnoreCase(name) && value.toLowerCase().contains("secure")) {
                        String[] cookieValues = value.split(";");
                        String newValue = "";
                        for (String cookieValue : cookieValues) {
                            if ("secure".equalsIgnoreCase(cookieValue.trim())) continue;
                            if (!newValue.isEmpty()) {
                                newValue = newValue + "; ";
                            }
                            newValue = newValue + cookieValue;
                        }
                        value = newValue;
                    }
                    response.addHeader(name, value);
                    infoLog.append("\n").append("    => ").append(name).append(": ").append(value);
                }
            }
            try {
                CustomProxyServlet.pipe(conn.getInputStream(), (OutputStream)response.getOutputStream());
            }
            catch (IOException ex) {
                CustomProxyServlet.pipe(conn.getErrorStream(), (OutputStream)response.getOutputStream());
            }
            finally {
                conn.disconnect();
            }
            this.log.info(infoLog.toString());
        } else {
            response.setStatus(400);
        }
    }

    private static void pipe(InputStream in, OutputStream out) throws IOException {
        try {
            if (in != null && out != null) {
                int read;
                byte[] b = new byte[4096];
                while ((read = in.read(b)) != -1) {
                    out.write(b, 0, read);
                }
            }
        }
        finally {
            if (in != null) {
                in.close();
            }
            if (out != null) {
                out.flush();
                out.close();
            }
        }
    }
}

