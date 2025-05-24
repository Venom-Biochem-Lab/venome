# [ tutorial.md ](..tutorial.md)


##

The [ tutorial.md ](..tutorial.md) contains more detailed instructions for running Venome.
For a quick-start guide, please see [ README.md ](..README.md)

## First Time Setup
This section covers the tools and software you will need to start running Venome.

**1. Docker**
Docker is a tool which allows users to build, run, and create templates for Containers.
Containers are akin to a small, lightweight, virtual machine which holds software code and 
its dependencies. Then these Containers are portable to other platforms without needing changes
to the configuration because Docker performs the translation between the Container and the host.

We use Docker in the Venome project. For nice GUI and ease of use, we suggest using 
[ Docker Desktop ](https://www.docker.com/products/docker-desktop/). Follow the instructions on 
the website to download and configure Docker Desktop for your machine.

**2. Building the Site**
This program has a script called [ run.sh ](..run.sh) which will take care of starting up the site. 
To execute this script, you will need to run it from a bash shell. This is done differently depending
on which operating system or code editor you are using. 

Linux and MacOS: Open your terminal, navigate to your Venome repository. In the terminal, execute the
 following command: 

```bash
./run.sh start
```

Windows: Windows doesn't nicely run shell scripts by itself. There are several options for running 
them. The method covered here uses VSCode and Git Bash. 
In VSCode, open a terminal (either by clicking the Terminal menu at the top of the screen or by navigating to the Terminal tab of the console).
In the top right corner of the terminal, select the dropdown menu next to the "new terminal" button
and select Git Bash. At last, you've managed to open up a bash shell on a Windows computer.

Navigate to the Venome repository and execute the following command: 

```bash
./run.sh start
```
This command will also start/run the Docker container

**3. Accessing the Database**
If you'd like to open a terminal directly into the database to execute SQL commands, execute the following command: 

```bash
./run.sh psql
```
For other commands relating to the database, see [ run.md ](..run.md) and [ database.md ](..database.md)

## First Time Setup (Conclusion)
The website should now be running locally. 

## Production Build
To run any command defined in [ run.sh ](..run.sh) in production mode, add a '-p' flag
For example: 

```bash
./run.sh start -p
```
There are a few other key differences in production builds compared to development builds, explained in [ build.md ](..build.md)

## Production Build (Conclusion) 
The production build scripts are used for website deployment. For more information about website deployment, see [ deployment.md ](..deployment.md)
