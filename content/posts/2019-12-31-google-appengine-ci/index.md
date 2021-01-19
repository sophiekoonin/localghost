---
title: "Deploying your Google AppEngine app with CircleCI"
subtitle: "Managing environment variables with CircleCI Contexts and a bit of bash magic"
summary: "How to set up CircleCI to inject environment variables and deploy your Google AppEngine app, as well as managing different deployment environments."
date: "2019-12-31"
tags: ['google cloud', 'circleci', 'tutorial']
---

The Google Cloud CLI makes it simple to deploy a Google AppEngine app with one command (`gcloud app deploy`), but there may come a time when you want to set up continuous integration with your app to take advantage of things like automatically running your tests or auto-deploying on merge. 

For me, another big advantage of using CI - in my case, [CircleCI](https://www.circleci.com) - was being able to store secrets securely as environment variables in Circle. AppEngine allows you to specify environment variables in the deployment manifest (usually `app.yaml`), but this would have meant hard-coding them and committing them in the repo, which is a big security no-no. We want things like API keys and client IDs/secrets to remain secret, because if someone got hold of these they could impersonate you or your app. 

In this article I'm going to take you through:

* how to set up CircleCI for your repository
* environment variables in CircleCI (including Google service account credentials)
* dynamically injecting environment variables into `app.yaml`
* deploying to Google AppEngine from CircleCI
* managing different deployment environments using CircleCI Contexts  

## Getting started with CircleCI 
If you're new to CircleCI, you can [sign in with GitHub](https://circleci.com/signup/). By giving it access to GitHub, it'll automatically look for your repositories and let you choose which ones to set up. Click the "Add projects" button, choose the repository for your AppEngine app, and click "Set Up Project".

{{< img class="inset-image big" src="*/ci-setup.png"  alt="The CircleCI project setup page showing setup options" >}}

Select the language you've used - in my case, it was Node - and it'll generate a sample CircleCI config file for you. This `config.yml` file will live in the root of your project, in a folder called `.circleci` (make sure you get the dot at the beginning). This is what CircleCI will look for in your repo to know what to do with your app. Create the folder, and follow the instructions that CircleCI gives you below the setup options to get started.

## Create a Google Cloud service account
Before CircleCI can deploy your AppEngine app, we need to configure some environment variables, including your Google Service Account credentials that will allow Circle to deploy. 

Create a new Service Account by going to the Google Cloud console and navigating to the [Service Accounts panel](https://console.cloud.google.com/iam-admin/serviceaccounts). Create a new service account and download the key as JSON (this is important).

When it comes to granting permissions, I found the Project Editor role was the only one that worked - which made me a little uncomfortable from the point of view of the [Principle of Least Privilege](https://heimdalsecurity.com/blog/what-is-the-principle-of-least-privilege/) - but the deployments didn't work when I gave it all the separate roles for Cloud Build and App Engine. (If anyone has a solution for this, I'd love to hear it.)

## Setting environment variables in CircleCI
Now we'll set the Google credentials as an environment variable, alongside the other env vars we'll need for our app. In my case, it was a Slack app, so I needed to store the Slack OAuth client ID and secret. 

From your project dashboard, click the cog to bring up the project settings, and then click "Environment Variables". 

{{< img class="inset-image" src="*/ci-settings.png" alt="The gear icon that opens up CircleCI project settings" >}}

{{< img class="inset-image big" src="*/ci-env-var.png" alt="The environment variables panel in CircleCI" >}}

Here, you can add in the name-value pairs you need. For my Slack app, that included a Slack Client ID, Client Secret, App ID and Signing Secret. Traditionally, env var names are written in `SCREAMING_SNAKE_CASE` (e.g. `SLACK_APP_ID`).

For the Google credentials, set an env var containing your project ID (you can find this from the "Project Info" panel in the Cloud Console) and one for your desired compute zone (e.g. `europe-west2`). Next, we'll create an environment variable containing your Google Service Account key.

## Storing a Google Service Account key as an environment variable
Since the JSON key is a multi-line variable, we can't just paste it into the value field. We'll encode it using `base64` and store the result of that as the env var value as recommended in the [CircleCI docs](https://circleci.com/docs/2.0/env-vars/#encoding-multi-line-environment-variables).

Open up a terminal, and enter the following command:

{{< highlight bash >}}
$ cat path/to/your/credentials.json | base64 | pbcopy
{{</highlight>}}

What this does: `cat` reads the contents of the json file and then **pipes** it using the `|` operator (feeds the result into) to the `base64` command. This will encode the contents of the key file, and then in turn pipes that to the system clipboard using `pbcopy`. The encoded value will then be available to paste straight into CircleCI.

Save your `GCLOUD_KEY` env var (or whatever you want to call it). Now we're ready to configure the deployment.

## Injecting environment variables into app.yaml
We'll need to make a change to our [`app.yaml`](https://cloud.google.com/appengine/docs/flexible/nodejs/reference/app-yaml) file so that we can inject the env vars from CircleCI. In our Circle config we're going to take advantage of the fact that the environment variables are available to us in bash, so we can reference them from a script. We're actually going to turn our `app.yaml` into a bash script.  

Here's my example `app.yaml`:

{{< highlight yaml >}}
runtime: nodejs12
instance_class: F1
automatic_scaling:
  max_instances: 1
env_variables:
  GCLOUD_PROJECT: "my_lovely_project"
  SLACK_APP_ID: A1B2C3D
{{< /highlight >}}

Rename the file to `app.yaml.sh` and add the shebang at the top of the file. We're then going to tell our script to `echo` the contents of our app config - when `echo` executes, it'll evaluate the `$VARIABLE_NAMES`, and pick up the values of those environment variables. 

{{< highlight bash >}}
#!/bin/bash
echo """
runtime: nodejs12
instance_class: F1
automatic_scaling:
  max_instances: 1
env_variables:
  GCLOUD_PROJECT: \"$GCLOUD_PROJECT\"
  SLACK_APP_ID: \"$SLACK_APP_ID\"
"""
{{< /highlight >}}

The quotation marks around the values are important for string values, even though they're technically optional in yaml. My Slack Client ID was a string with the format `12345.67890` and because I'd left off the quotation marks, my app interpreted it as a number and rounded it up, resulting in an invalid Client ID.

Please note, once you've done this you won't be able to **manually** deploy your app from the local CLI with this `app.yaml.sh` file, unless you have these environment variables set locally.

## Setting up CircleCI config.yml
The example `config.yml` that CircleCI provides for a Node app looks something like this, with a few more comments I've removed for brevity:

{{< highlight yaml >}}
version: 2
jobs:
  build:
    docker:
      # specify the version you desire here
      - image: circleci/node:7.10

    working_directory: ~/repo

    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-

      - run: yarn install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}

      # run tests!
      - run: yarn test
{{< /highlight >}}

We're going to tell Circle to use the `google/cloud-sdk` docker image instead, as Google will be handling the actual building of our app, so CircleCI doesn't need to know what version of Node we're using. 

If you're planning on getting CircleCI to run your tests, you'll want to keep in the part about downloading and caching dependencies, but for the purpose of this tutorial we're going to take it out as we're focusing on deployment. 

Let's rename the `build` step to `deploy`, and switch out the docker image. We'll keep the working directory and the `checkout` step as-is. 

Next, we'll copy across the `app.yaml` by adding a `run` step, executing our new `app.yaml.sh` script and **redirecting** the result with `>` (saving to a file) to a new `app.yaml` file.

{{< highlight yaml >}}
version: 2
jobs:
  deploy:
    docker:
      - image: google/cloud-sdk

    working_directory: ~/repo

    steps:
      - checkout
      - run:
          name: Copy across app.yaml config
          command: ./app.yaml.sh > ./app.yaml
{{< /highlight >}}

### Authenticating with Google Cloud 

Then, we need to get CircleCI to authenticate with Google Cloud. This is where we'll decode our base-64 encrypted environment variable and use the Cloud SDK to authenticate.

{{< highlight yaml >}}
      - run:
          name: Set up gcloud config
          command: |
            echo $GCLOUD_KEY | base64 --decode | gcloud auth activate-service-account --key-file=-
            gcloud --quiet config set project ${GCLOUD_PROJECT}
            gcloud --quiet config set compute/zone ${GCLOUD_ZONE}
{{</highlight>}}         

Here, we're `echo`ing out the value of our `$GCLOUD_KEY` variable, piping it into `base64` with the decode flag, and then piping the newly decoded value into the `gcloud auth activate-service-account` command, with the flag `-key-file=-`. This mysterious hyphen `-` tells the command to use standard input (`stdin`) rather than a given filename. In our case, standard input will be what we've piped into the command from `base64 --decode`.

We're then running commands to set the gcloud config (with the `--quiet` flag so the output doesn't fill up the CircleCI logs). 

Finally, we can add a last step to deploy the project, using the same CLI command that you would have used manually. 

{{< highlight yaml >}}
version: 2
jobs:
  deploy:
    docker:
      - image: google/cloud-sdk

    working_directory: ~/repo

    steps:
      - checkout
      - run:
          name: Copy across app.yaml config
          command: ./app.yaml.sh > ./app.yaml
      - run:
          name: Set up gcloud config
          command: |
            echo $GCLOUD_KEY | base64 --decode | gcloud auth activate-service-account --key-file=-
            gcloud --quiet config set project ${GCLOUD_PROJECT}
            gcloud --quiet config set compute/zone ${GCLOUD_ZONE}
      - deploy:
          name: Deploying to App Engine
          command: gcloud app deploy app.yaml
{{< /highlight >}}

### Defining a workflow 

Now you need to define a [workflow](https://circleci.com/docs/2.0/workflows/#overview) at the bottom of `config.yml` that will execute this step when you push to master. 

{{< highlight yaml >}}
workflows:
  deploy:
    jobs:
      - deploy:
          name: deploy-app
          filters:
            branches:
              only: master
{{</highlight>}}

This is a single-step workflow which will only execute on the `master` branch.

Commit and push your new `app.yaml.sh` and `.circleci/config.yml` files, and head to your CircleCI project dashboard. If everything worked, you should get a nice green build after a couple of minutes! If the build fails and you're not sure why, you can check the Cloud Build logs (head to the [StackDriver Logs Viewer](https://console.cloud.google.com/logs/) and choose Cloud Build from the resource dropdown).

## Managing different environments with CircleCI Contexts
If you want to have multiple deployed versions of your app - for example, a staging environment and a production environment - you'll need different environment variables depending on where you're deploying to. CircleCI Contexts allow you to define sets of environment variables that you can use in different steps of the workflow. 

Contexts are defined at the organisation level, so head to your Organisation Settings page and open the "Contexts" panel.

{{< img class="inset-image" src="*/ci-context.png" alt="The CircleCI Contexts panel" >}}

Click the "Create Context" button, and give it a name (I've used 'Example App Production' for this tutorial). On the page for the context itself, you can add any environment variables your app needs. Any environment variables you defined earlier in the tutorial, you'll need here - including Google Cloud credentials. I created a separate Google Cloud project for my staging application, so I had a different set of Google Cloud credentials for staging and production. 

I created a context for production deployments, and kept the "default" set of environment variables for my staging deployments. 

To use your new context, pass in a `context` value to your workflow step, as follows:

{{< highlight yaml >}}
workflows:
  deploy:
    jobs:
      - deploy:
          name: deploy-prod
          context: "Example App Production"
{{</highlight>}}

This tells CircleCI to use the environment variables from the given context rather than the project-level ones. If you don't include the `context` field, it'll pick up the environment variables you defined earlier in the project settings, so for my staging deployments I don't specify a context.

## Manual approval steps
I don't want to automatically deploy to production, so I've put a manual approval step between my staging and production workflow steps. I can then prevent the `deploy-prod` step from running unless the manual approval step has completed.

{{< highlight yaml >}}
workflows:
  deploy:
    jobs:
      - deploy:
          name: deploy-staging
          filters:
            branches:
              only: master
      - approve-prod-deployment:
          type: approval
          requires:
            - deploy-staging
      - deploy:
          name: deploy-prod
          context: "Example App Production"
          requires:
            - approve-prod-deployment
{{</highlight>}}

This workflow looks something like this:

{{< img class="inset-image big" src="*/ci-workflow.png" alt="CircleCI workflow with manual approval" >}}

Once you approve the manual step, the next step will kick off automatically.

## You're all set! 
Now, you should be able to deploy your Google AppEngine app automatically via CircleCI and manage multiple deployment environments, storing your application secrets within CircleCI. 

For further reading I recommend looking at the [CircleCI Docs](https://circleci.com/docs/2.0/), they're pretty helpful - in fact there's one on setting up [Google Auth](https://circleci.com/docs/2.0/google-auth/) I found useful while building my app. 

Any questions? Let me know on Twitter: [@type__error](https://twitter.com/type__error)