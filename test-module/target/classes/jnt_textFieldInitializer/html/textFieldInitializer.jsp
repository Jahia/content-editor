<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<div>
  <p>defaultDate:${currentNode.properties['defaultDate'].string}</p>
  <p>defaultDateAutocreated:${currentNode.properties['defaultDateAutocreated'].string}</p>
  <p>defaultI18nDate:${currentNode.properties['defaultI18nDate'].string}</p>
  <p>defaultI18nDateAutocreated:${currentNode.properties['defaultI18nDateAutocreated'].string}</p>
  <p>defaultI18nString:${currentNode.properties['defaultI18nString'].string}</p>
  <p>defaultI18nStringAutocreated:${currentNode.properties['defaultI18nStringAutocreated'].string}</p>
  <p>defaultString:${currentNode.properties['defaultString'].string}</p>
  <p>defaultStringAutocreated:${currentNode.properties['defaultStringAutocreated'].string}</p>
  <p>moduleI18nRBAutocreatedString:${currentNode.properties['moduleI18nRBAutocreatedString'].string}</p>
  <p>moduleI18nRBString:${currentNode.properties['moduleI18nRBString'].string}</p>
  <p>moduleRBAutocreatedString:${currentNode.properties['moduleRBAutocreatedString'].string}</p>
  <p>moduleRBString:${currentNode.properties['moduleRBString'].string}</p>
  <p>systemI18nRBAutocreatedMySettings:${currentNode.properties['systemI18nRBAutocreatedMySettings'].string}</p>
  <p>systemI18nRBFirstName:${currentNode.properties['systemI18nRBFirstName'].string}</p>
  <p>systemRBAutocreatedPreferredLanguage:${currentNode.properties['systemRBAutocreatedPreferredLanguage'].string}</p>
  <p>systemRBTitle:${currentNode.properties['systemRBTitle'].string} </p>
  <p>moduleClassInitString:${currentNode.properties['moduleClassInitString'].string} </p>
</div>
