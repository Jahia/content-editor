<%@ page import="org.jahia.settings.SettingsBean"%>
<%@ page language="java" contentType="text/javascript" %>
<%
    SettingsBean settingsBean = SettingsBean.getInstance();
%>
contextJsParameters.config.wip="<%= settingsBean.getString("wip.link", "https://academy.jahia.com/documentation/enduser/jahia/8/authoring-content-in-jahia/using-content-editor/understanding-work-in-progress-content")%>";
contextJsParameters.config.maxNameSize=<%= settingsBean.getMaxNameSize() %>;

