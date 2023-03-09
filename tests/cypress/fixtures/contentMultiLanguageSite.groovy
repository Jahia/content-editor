import org.jahia.api.Constants
import org.jahia.services.content.JCRCallback
import org.jahia.services.content.JCRSessionFactory
import org.jahia.services.content.JCRSessionWrapper
import org.jahia.services.content.JCRTemplate
import org.jahia.services.content.decorator.JCRSiteNode
import org.jahia.services.sites.JahiaSite
import org.jahia.services.sites.JahiaSitesService
import org.jahia.services.sites.SiteCreationInfo
import org.jahia.services.usermanager.JahiaUserManagerService

import javax.jcr.RepositoryException

JahiaSitesService sitesService = JahiaSitesService.getInstance();
if (sitesService.getSiteByKey("SITEKEY") == null) {
    JahiaSite site = sitesService.addSite(SiteCreationInfo.builder().
            siteKey("SITEKEY").
            serverName("localhost").
            title("SITEKEY").
            templateSet("dx-base-demo-templates").
            locale("en").build())

    JCRCallback callback = new JCRCallback() {
        @Override
        Object doInJCR(JCRSessionWrapper jcrSessionWrapper) throws RepositoryException {
            JCRSiteNode siteByKey = sitesService.getSiteByKey("SITEKEY", jcrSessionWrapper)
            Set<String> languages = new HashSet<String>(Arrays.asList("en","fr","de"))
            siteByKey.setLanguages(languages)
            languages.remove("de")
            siteByKey.setMandatoryLanguages(languages)
            siteByKey.setDefaultLanguage("en")
            List<String> installedModules = siteByKey.getInstalledModules();
            installedModules.add('dx-base-demo-components');
            siteByKey.setInstalledModules(installedModules);
            jcrSessionWrapper.save()
            return null
        }
    }
    JCRTemplate.instance.doExecuteWithSystemSessionAsUser(JahiaUserManagerService.instance.lookupUser("root").jahiaUser,
            Constants.EDIT_WORKSPACE, Locale.ENGLISH, callback);
}
