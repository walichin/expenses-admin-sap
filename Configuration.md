

## To Run CompGastos Locally:

Pull from Git and In web.xml file add:

	<context-param>
		<param-name>com.sap.ui5.proxy.REMOTE_LOCATION</param-name>
		<param-value>http://joyas18.grupocristal.com.mx:1080</param-value>
	</context-param>
	
Change the url to point to your SAP environment. This will prompt a user/password dialog once, where a SAP user and password has to be entered.

## To Run CompGastos in Dev or upper environments

A) In order to hide authentication when accessing SAP, a reverse proxy has to be created. For this: Apache needs to be installed and a Vhost configuration should set up the reverse proxy.

The reverse proxy looks like the one below. (Note that in this case, http server needs to listen port 90. Hosts file should map compgastos-sap-dev to localhost. The Basic authorization is injected so no user and password will be requested. 

```
<VirtualHost *:90>
    ServerName compgastos-sap-dev
    ProxyRequests Off    
    RequestHeader set Authorization "Basic Y29uc3VsdG9yOjEyM1NhcHVpNTEyMw=="
    ProxyPass / http://joyas18.grupocristal.com.mx:1080/
    ProxyPassReverse / http://joyas18.grupocristal.com.mx:1080/ 
</VirtualHost>
```

B) 	Start Java server (Tomcat, WildFly, JBoss, etc) adding: -Dcom.sap.ui5.proxy.REMOTE_LOCATION=http://compgastos-sap-dev:90 . This will reroute all queries to SAP to the reverse proxy and add credentials (user and password) internally.



	