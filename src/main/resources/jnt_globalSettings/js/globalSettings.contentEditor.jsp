<%@ page import="org.jahia.settings.SettingsBean"%>
<%@ page language="java" contentType="text/javascript" %>
<%
    SettingsBean settingsBean = SettingsBean.getInstance();
%>
contextJsParameters.config.wip="<%= settingsBean.getString("wip.link", "https://academy.jahia.com/documentation/digital-experience-manager/8.0/functional/how-to-contribute-content#Work_in_Progress")%>";
contextJsParameters.config.maxNameSize=<%= settingsBean.getMaxNameSize() %>;

