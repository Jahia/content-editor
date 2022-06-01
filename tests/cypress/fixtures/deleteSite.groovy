import org.jahia.services.sites.JahiaSitesService

JahiaSitesService sitesService = JahiaSitesService.getInstance();
if (sitesService.getSiteByKey("SITEKEY") != null) {
    sitesService.removeSite(sitesService.getSiteByKey("SITEKEY"));
}
