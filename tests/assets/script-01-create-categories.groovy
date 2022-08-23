/**
 * Created by parveer on 21-08-19.
 */
import org.jahia.api.Constants
import org.jahia.services.content.JCRCallback
import org.jahia.services.content.JCRSessionWrapper
import org.jahia.services.content.JCRTemplate
import org.jahia.services.usermanager.JahiaUserManagerService

import javax.jcr.RepositoryException

String siteKey = "systemsite"
String marketsCategories = "<?xml version=\"1.0\"?>\n" +
        "<markets xmlns:j=\"http://www.jahia.org/jahia/1.0\" xmlns:jcr=\"http://www.jcp.org/jcr/1.0\" jcr:primaryType=\"jnt:category\">\n" +
        "    <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                      jcr:title=\"Markets and Applications\"/>\n" +
        "    <_x0031_03 jcr:primaryType=\"jnt:category\">\n" +
        "        <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                          jcr:title=\"Automotive &amp; Transportation\"/>\n" +
        "        <_x0033_019 jcr:primaryType=\"jnt:category\">\n" +
        "            <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                              jcr:title=\"Caravaning/Recreational Vehicle\"/>\n" +
        "            <_x0032_408 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"WINDOW (AEROSPACE)\"/>\n" +
        "            </_x0032_408>\n" +
        "            <_x0034_483 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Other Caravane/Recreational\"/>\n" +
        "            </_x0034_483>\n" +
        "            <_x0034_910 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Cluster lens (Caravaning/Recreational Vehicle)\"/>\n" +
        "            </_x0034_910>\n" +
        "            <_x0034_917 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"EXTERIOR LIGHTING - FORWARD (CARAVANING/RECREATIONAL VEHICLE\"/>\n" +
        "            </_x0034_917>\n" +
        "            <_x0034_921 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Exterior lighting - Rear (Caravaning/Recreational Vehicle)\"/>\n" +
        "            </_x0034_921>\n" +
        "            <_x0034_925 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"EXTERIOR TRIM - DECORATIVE PARTS (CARAVANING/RECREATIONAL VE\"/>\n" +
        "            </_x0034_925>\n" +
        "            <_x0034_933 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Glazing (Caravaning/Recreational Vehicle)\"/>\n" +
        "            </_x0034_933>\n" +
        "            <_x0034_960 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Sensing/RADAR Application (Caravaning/Recreational Vehicle)\"/>\n" +
        "            </_x0034_960>\n" +
        "            <_x0034_972 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Window (Caravaning/Recreational Vehicle)\"/>\n" +
        "            </_x0034_972>\n" +
        "            <_x0034_975 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Thermoformed Body Parts (Caravaning)\"/>\n" +
        "            </_x0034_975>\n" +
        "        </_x0033_019>\n" +
        "    </_x0031_03>\n" +
        "    <_x0031_05 jcr:primaryType=\"jnt:category\">\n" +
        "        <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                          jcr:title=\"Chemical And Plastic Industry\"/>\n" +
        "        <_x0033_029 jcr:primaryType=\"jnt:category\">\n" +
        "            <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                              jcr:title=\"Polymer Manufacturing\"/>\n" +
        "            <_x0031_149 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"PVC\"/>\n" +
        "            </_x0031_149>\n" +
        "            <_x0031_153 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"ACRYLICS\"/>\n" +
        "            </_x0031_153>\n" +
        "            <_x0031_166 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"ANTI OXYDANT\"/>\n" +
        "            </_x0031_166>\n" +
        "            <_x0031_167 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"PMMA\"/>\n" +
        "            </_x0031_167>\n" +
        "            <_x0031_168 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"ACRYLIC IMPACT MODIFIERS (AIM) AND MBS\"/>\n" +
        "            </_x0031_168>\n" +
        "            <_x0031_169 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"ACRYLONITRILE STYRENE ACRYLATES (ASA)\"/>\n" +
        "            </_x0031_169>\n" +
        "            <_x0031_170 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Ethylene Acrylate Copolymers (Funct Polyolefins)  And Elasto\"/>\n" +
        "            </_x0031_170>\n" +
        "            <_x0031_173 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"PERFORMANCE POLYMERS\"/>\n" +
        "            </_x0031_173>\n" +
        "            <_x0031_199 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CHEMICALS MANUFACTURING\"/>\n" +
        "            </_x0031_199>\n" +
        "            <_x0031_339 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"XL WIRE &amp; CABLE\"/>\n" +
        "            </_x0031_339>\n" +
        "            <_x0032_403 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"ACRYLIC  AND CARBON FIBER\"/>\n" +
        "            </_x0032_403>\n" +
        "            <_x0032_653 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"COMPOUNDING\"/>\n" +
        "            </_x0032_653>\n" +
        "            <_x0034_019 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CHAIN TRANSFER AGENT\"/>\n" +
        "            </_x0034_019>\n" +
        "            <_x0034_020 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"TERMINATION AGENT\"/>\n" +
        "            </_x0034_020>\n" +
        "            <_x0034_022 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"SOLVENT\"/>\n" +
        "            </_x0034_022>\n" +
        "            <_x0034_023 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"INITIATOR\"/>\n" +
        "            </_x0034_023>\n" +
        "            <_x0034_024 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"SHORT STOPPER\"/>\n" +
        "            </_x0034_024>\n" +
        "            <_x0034_025 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"MONOMER/CO-MONOMER\"/>\n" +
        "            </_x0034_025>\n" +
        "            <_x0034_026 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CURING AGENT\"/>\n" +
        "            </_x0034_026>\n" +
        "            <_x0034_027 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"FILLERS\"/>\n" +
        "            </_x0034_027>\n" +
        "            <_x0034_028 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"AOX\"/>\n" +
        "            </_x0034_028>\n" +
        "            <_x0034_073 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CHAIN EXTENDER\"/>\n" +
        "            </_x0034_073>\n" +
        "            <_x0034_267 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"STYRENICS\"/>\n" +
        "            </_x0034_267>\n" +
        "            <_x0034_270 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"COATING RESINS\"/>\n" +
        "            </_x0034_270>\n" +
        "            <_x0034_271 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"EPS\"/>\n" +
        "            </_x0034_271>\n" +
        "            <_x0034_272 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"LDPE/EVA\"/>\n" +
        "            </_x0034_272>\n" +
        "            <_x0034_274 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"XL RUBBER DISTRIB\"/>\n" +
        "            </_x0034_274>\n" +
        "            <_x0034_275 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"POLYSTYRENE (GPPS, HIPS)\"/>\n" +
        "            </_x0034_275>\n" +
        "            <_x0034_276 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"PP VISBREAKING\"/>\n" +
        "            </_x0034_276>\n" +
        "            <_x0034_277 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"SOLAR CELL\"/>\n" +
        "            </_x0034_277>\n" +
        "            <_x0034_278 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"XL RUBBER COMPOUNDER\"/>\n" +
        "            </_x0034_278>\n" +
        "            <_x0034_279 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"XL EVA ( EXCL SOLAR CELL)\"/>\n" +
        "            </_x0034_279>\n" +
        "            <_x0034_280 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"XL ROTOMOLDING\"/>\n" +
        "            </_x0034_280>\n" +
        "            <_x0034_281 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"XL RUBBER\"/>\n" +
        "            </_x0034_281>\n" +
        "            <_x0034_284 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CAST POLYMERISATION\"/>\n" +
        "            </_x0034_284>\n" +
        "            <_x0034_285 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"POLYMERISATION\"/>\n" +
        "            </_x0034_285>\n" +
        "            <_x0034_658 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"PLASTICIZERS\"/>\n" +
        "            </_x0034_658>\n" +
        "            <_x0034_908 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CATALYST (POLYMER)\"/>\n" +
        "            </_x0034_908>\n" +
        "            <_x0035_001 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"XL INDUSTRY\"/>\n" +
        "            </_x0035_001>\n" +
        "            <_x0035_002 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"CO PRODUCER\"/>\n" +
        "            </_x0035_002>\n" +
        "            <_x0035_003 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"RECYCLING\"/>\n" +
        "            </_x0035_003>\n" +
        "            <_x0035_004 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"GENERAL CHEMICALS\"/>\n" +
        "            </_x0035_004>\n" +
        "            <_x0035_029 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CO &amp; TER POLYMERS OF ACRYLIC ACID AND ESTERS\"/>\n" +
        "            </_x0035_029>\n" +
        "            <_x0035_030 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"INTERMEDIATES AND CATALYSTS (POLYM. MAN.)\"/>\n" +
        "            </_x0035_030>\n" +
        "            <_x0035_065 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"Acrylic Based Resins\"/>\n" +
        "            </_x0035_065>\n" +
        "            <_x0035_066 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"ACRYLIC IMPACT MODIFIERS (AIM)\"/>\n" +
        "            </_x0035_066>\n" +
        "            <_x0035_088 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"SUPERPLASTICIZIER (POLYM. MAN.)\"/>\n" +
        "            </_x0035_088>\n" +
        "            <_x0035_096 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"OTHERS (POLYMER MANUFACTURING)\"/>\n" +
        "            </_x0035_096>\n" +
        "            <_x0035_068 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"CHEMICALS MANUFACTURING (CHEM. MAN.)\"/>\n" +
        "            </_x0035_068>\n" +
        "            <_x0035_097 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"INTERMEDIATES AND CATALYSTS (CHEM)\"/>\n" +
        "            </_x0035_097>\n" +
        "        </_x0033_029>\n" +
        "        <_x0033_096 jcr:primaryType=\"jnt:category\">\n" +
        "            <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                              jcr:title=\"Chemical &amp; Plastic Distribution\"/>\n" +
        "            <_x0031_130 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"INDUSTRY - DISTRIBUTION\"/>\n" +
        "            </_x0031_130>\n" +
        "            <_x0031_172 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"DISTRIBUTION &amp; TRADER\"/>\n" +
        "            </_x0031_172>\n" +
        "            <_x0031_177 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"DISTRIBUTION (CHEMICAL INDUSTRY)\"/>\n" +
        "            </_x0031_177>\n" +
        "            <_x0031_198 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"DISINFECTION (DISTRIBUTION)\"/>\n" +
        "            </_x0031_198>\n" +
        "            <_x0032_240 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"OTHER OTHERS\"/>\n" +
        "            </_x0032_240>\n" +
        "            <_x0032_655 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"INDUSTRY - DISTRIBUTION\"/>\n" +
        "            </_x0032_655>\n" +
        "            <_x0033_006 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"HEATING SYSTEM\"/>\n" +
        "            </_x0033_006>\n" +
        "            <_x0033_018 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"OTHERS (DISTRIBUTION)\"/>\n" +
        "            </_x0033_018>\n" +
        "            <_x0033_024 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"REPACKING FROM THE TRUCK (DISTRIBUTION)\"/>\n" +
        "            </_x0033_024>\n" +
        "            <_x0033_032 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"WAREHOUSE OR STORAGETANKS (DISTRIBUTION)\"/>\n" +
        "            </_x0033_032>\n" +
        "            <_x0033_048 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"BLEACHING (DISTRIBUTION)\"/>\n" +
        "            </_x0033_048>\n" +
        "            <_x0034_009 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"MULTIPURPOSE (AGRO)\"/>\n" +
        "            </_x0034_009>\n" +
        "            <_x0034_229 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"INORGANIC COMPOUNDS (DIST IND)\"/>\n" +
        "            </_x0034_229>\n" +
        "            <_x0034_231 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"NOT IDENTIFIED (DIST IND)\"/>\n" +
        "            </_x0034_231>\n" +
        "            <_x0034_232 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"ORGANIC COMPOUNDS (DIST IND)\"/>\n" +
        "            </_x0034_232>\n" +
        "            <_x0034_233 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"OTHERS (DIST IND)\"/>\n" +
        "            </_x0034_233>\n" +
        "            <_x0034_570 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\" jcr:title=\"\"/>\n" +
        "            </_x0034_570>\n" +
        "            <_x0034_943 jcr:primaryType=\"jnt:category\">\n" +
        "                <j:translation_en jcr:primaryType=\"jnt:translation\" jcr:mixinTypes=\"mix:title\"\n" +
        "                                  jcr:title=\"MULTIPURPOSE (CHEMICAL &amp; PLASTIC DISTRIBUTION)\"/>\n" +
        "            </_x0034_943>\n" +
        "        </_x0033_096>\n" +
        "    </_x0031_05>\n" +
        "</markets>\n";

def decodedName = { node ->
    if (node.name().startsWith("_x003")) {
        def toto = node.name().split("_x003")[1].split("_")
        ""+Integer.parseInt(toto[0],16)+toto[1]
    } else {
        node.name()
    }
}

JCRCallback<Object> callback = new JCRCallback<Object>() {
    @Override
    Object doInJCR(JCRSessionWrapper session) throws RepositoryException {
        def node = session.getNode("/sites/" + siteKey + "/categories")
        def musicCategory = node.addNode("music", "jnt:category")
        musicCategory.setProperty("jcr:title", "Music")

        def musicSubCategory = musicCategory.addNode("blues", "jnt:category")
        musicSubCategory.setProperty("jcr:title", "Blues")
        musicSubCategory.addNode("acoustic_blues", "jnt:category").setProperty("jcr:title", "Acoustic Blues")

        musicSubCategory.addNode("canadian_blues", "jnt:category").setProperty("jcr:title", "Canadian Blues")

        def classicalSubCategory = musicCategory.addNode("classical", "jnt:category")
        classicalSubCategory.setProperty("jcr:title", "Classical")
        classicalSubCategory.addNode("classical_crossover", "jnt:category").setProperty("jcr:title", "Classical Crossover")


        def electronicSubCategory = musicCategory.addNode("electronic", "jnt:category")
        electronicSubCategory.setProperty("jcr:title", "Electronic")
        electronicSubCategory.addNode("chiptune", "jnt:category").setProperty("jcr:title", "Chiptune")
        electronicSubCategory.addNode("drum_n_bass", "jnt:category").setProperty("jcr:title", "Drum N Bass")

        def categories = new XmlSlurper().parseText(marketsCategories)
        def rootCat = node.addNode(decodedName(categories), "jnt:category");
        rootCat.setProperty("jcr:title", categories.translation_en.'@jcr:title'.toString());
        categories.'*'.findAll { l0 -> l0['@jcr:primaryType'] == 'jnt:category' }*.each { l0 ->
            def l0Cat = rootCat.addNode(decodedName(l0), "jnt:category");
            l0Cat.setProperty("jcr:title", l0.translation_en.'@jcr:title'.toString());
            l0.'*'.findAll { l1 -> l1['@jcr:primaryType'] == 'jnt:category' }*.each { l1 ->
                def l1Cat = l0Cat.addNode(decodedName(l1), "jnt:category");
                l1Cat.setProperty("jcr:title", l1.translation_en.'@jcr:title'.toString());
                l1.'*'.findAll { l2 -> l2['@jcr:primaryType'] == 'jnt:category' }*.each { l2 ->
                    def l2Cat = l1Cat.addNode(decodedName(l2), "jnt:category");
                    l2Cat.setProperty("jcr:title", l2.translation_en.'@jcr:title'.toString());
                    l2.'*'.findAll { l3 -> l3['@jcr:primaryType'] == 'jnt:category' }*.each { l3 ->
                        def l3Cat = l2Cat.addNode(decodedName(l3), "jnt:category");
                        l3Cat.setProperty("jcr:title", l3.translation_en.'@jcr:title'.toString());
                        l3.'*'.findAll { l4 -> l4['@jcr:primaryType'] == 'jnt:category' }*.each { l4 ->
                            def l4Cat = l3Cat.addNode(decodedName(l4), "jnt:category");
                            l4Cat.setProperty("jcr:title", l4.translation_en.'@jcr:title'.toString());
                        }
                    }
                }
            }
        }
        session.save()
        return null
    }
}
JCRTemplate.instance.doExecuteWithSystemSessionAsUser(JahiaUserManagerService.instance.lookupUser("root").jahiaUser,
        Constants.EDIT_WORKSPACE, Locale.ENGLISH, callback);
