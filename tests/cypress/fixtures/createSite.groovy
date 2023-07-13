import org.jahia.services.sites.JahiaSite
import org.jahia.services.sites.JahiaSitesService
import org.jahia.services.sites.SiteCreationInfo

JahiaSitesService sitesService = JahiaSitesService.getInstance();
if (sitesService.getSiteByKey("SITEKEY") == null) {
    JahiaSite site = sitesService.addSite(SiteCreationInfo.builder().
            siteKey("SITEKEY").
            serverName("localhost").
            title("SITEKEY").
            modulesToDeploy(new String[] {"content-editor-test-module"}).
            templateSet("dx-base-demo-templates").
            locale("en").build())
}

