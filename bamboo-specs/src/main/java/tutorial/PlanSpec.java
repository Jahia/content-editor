package tutorial;

import com.atlassian.bamboo.specs.api.BambooSpec;
import com.atlassian.bamboo.specs.api.builders.plan.Job;
import com.atlassian.bamboo.specs.api.builders.plan.Plan;
import com.atlassian.bamboo.specs.api.builders.plan.PlanIdentifier;
import com.atlassian.bamboo.specs.api.builders.plan.Stage;
import com.atlassian.bamboo.specs.api.builders.plan.artifact.Artifact;
import com.atlassian.bamboo.specs.api.builders.project.Project;
import com.atlassian.bamboo.specs.api.builders.requirement.Requirement;
import com.atlassian.bamboo.specs.builders.task.MavenTask;
import com.atlassian.bamboo.specs.builders.task.ScriptTask;
import com.atlassian.bamboo.specs.builders.task.VcsCheckoutTask;
import com.atlassian.bamboo.specs.util.BambooServer;
import com.atlassian.bamboo.specs.api.builders.permission.Permissions;
import com.atlassian.bamboo.specs.api.builders.permission.PermissionType;
import com.atlassian.bamboo.specs.api.builders.permission.PlanPermissions;

/**
 * Plan configuration for Bamboo.
 * Learn more on: <a href="https://confluence.atlassian.com/display/BAMBOO/Bamboo+Specs">https://confluence.atlassian.com/display/BAMBOO/Bamboo+Specs</a>
 */
@BambooSpec
public class PlanSpec {

    /**
     * Run main to publish plan on Bamboo
     */
    public static void main(final String[] args) throws Exception {
        //By default credentials are read from the '.credentials' file.
        BambooServer bambooServer = new BambooServer("http://localhost:8085");

        Plan plan = new PlanSpec().createPlan();

        bambooServer.publish(plan);

        //PlanPermissions planPermission = new PlanSpec().createPlanPermission(plan.getIdentifier());

        //bambooServer.publish(planPermission);
    }

    PlanPermissions createPlanPermission(PlanIdentifier planIdentifier) {
        Permissions permission = new Permissions()
                .userPermissions("admin", PermissionType.ADMIN, PermissionType.CLONE, PermissionType.EDIT)
                .groupPermissions("bamboo-admin", PermissionType.ADMIN)
                .loggedInUserPermissions(PermissionType.VIEW)
                .anonymousUserPermissionView();
        return new PlanPermissions(planIdentifier.getProjectKey(), planIdentifier.getPlanKey()).permissions(permission);
    }

    Project project() {
        return new Project()
                .name("Project Name")
                .key("PRJ");
    }

    Plan createPlan() {
        Project project = new Project().key("FORGEMODULESSET");

        MavenTask mavenTask = new MavenTask()
            .goal("clean install")
            .hasTests(false)
            .version3()
            .jdk("JDK 1.8")
            .executableLabel("Maven 3");

        Artifact artifact = new Artifact("library").location("target/*.jar");

        Job job = new Job("Maven clean install", "JOB1")
            .tasks(mavenTask)
            .requirements(new Requirement("system.builder.mvn3.Maven 3"))
            .requirements(new Requirement("module_agent"))
            .artifacts(artifact)
            .finalTasks(new ScriptTask().fileFromPath("scripts/github-status.sh"));

        Stage stage = new Stage("Build Stage")
            .description("Main stage")
            .jobs(job)
            .manual(true);

        return new Plan(project, "Content Editor Spec Test", "CEST")
            .description("Yolo maybe it will work")
            .enabled(true)
            .stages(stage);
    }


}
