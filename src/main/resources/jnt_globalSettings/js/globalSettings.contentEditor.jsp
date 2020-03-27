<%@ page import="org.jahia.settings.SettingsBean"%><%@ page language="java" contentType="text/javascript" %>
contextJsParameters.config.wipOnCreate=<%= Boolean.valueOf(SettingsBean.getInstance().getString("wip.checkbox.checked", "false"))%>;
