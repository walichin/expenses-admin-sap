# How to Install CompGastos in Cristal server 

## Setup HTTP Server

In this case, Apache is being used. The reason for this is to create a reverse proxy that points to SAP server, which will hide authentication to the end-user. In other words, the end user will never enter SAP user and password, it will be injected by the Apache reverse proxy configuration.

<VirtualHost *:90>
    ServerName compgastos-sap-dev
    ProxyRequests Off    
    RequestHeader set Authorization "Basic Y29uc3VsdG9yOjEyM1NhcHVpNTEyMw=="
    ProxyPass / http://joyas18.grupocristal.com.mx:1080/
    ProxyPassReverse / http://joyas18.grupocristal.com.mx:1080/ 
</VirtualHost>

## Setup JEE Server

For this, there are several application servers. Application was tested in Tomcat and Wildfly. In order to run multiple instances (servers) we switch from Tomcat to Wildfly

### Where to deploy

Wildfly contains a /standalone folder where a server instance is being configured. We will copy as many times as needed this folder to create multiple instances. In our case, we will need two instances Dev and Qa, so 
we created /standalone-cristal-dev and /standalone-cristal-qa



