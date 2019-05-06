Project project = new Project().key("FORGEMODULESSET");

MavenTask mavenTask = new MavenTask()
    .goal("clean install")
    .hasTests(false)
    .version3()
    .jdk("JDK 1.8")
    .executableLabel("Maven 3.x");

Artifact artifact = new Artifact("library").location("target/*.jar");

Job job = new Job("Maven clean install", "JOB1")
    .tasks(new VcsCheckoutTask().addCheckoutOfDefaultRepository())
    .tasks(mavenTask)
      .requirements(new Requirement("system.builder.mvn3.Maven 3"))
      .requirements(new Requirement("module_agent"))
      .artifacts(artifact)
    .finalTasks(new ScriptTask().fileFromPath("cleanup.sh"));

Stage stage = new Stage("Build Stage")
    .description("Main stage")
    .jobs(job)
    .manual(true);

Plan plan = new Plan(project, "Content Editor Spec Test", "CEST")
    .description("Yolo maybe it will work")
    .enabled(true)
    .stages(stage);
