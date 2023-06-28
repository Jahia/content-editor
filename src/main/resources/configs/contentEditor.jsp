<%@ page import="org.jahia.settings.SettingsBean"%><%@ page import="org.json.JSONObject"%><%@ page import="org.jahia.services.modulemanager.spi.ConfigService"%><%@ page import="org.jahia.osgi.BundleUtils"%><%@ page language="java" contentType="text/javascript" %>
<%
    SettingsBean settingsBean = SettingsBean.getInstance();
%>
contextJsParameters.config.wip="<%= settingsBean.getString("wip.link", "https://academy.jahia.com/documentation/enduser/jahia/8/authoring-content-in-jahia/using-content-editor/understanding-work-in-progress-content")%>";
contextJsParameters.config.maxNameSize=<%= settingsBean.getMaxNameSize() %>;
contextJsParameters.config.defaultSynchronizeNameWithTitle=<%= settingsBean.getString("jahia.ui.contentTab.defaultSynchronizeNameWithTitle", "true") %>;
contextJsParameters.config.contentEditor = <%= new JSONObject(BundleUtils.getOsgiService(ConfigService.class, null).getConfig("org.jahia.modules.contentEditor").getRawProperties()).toString() %>;
