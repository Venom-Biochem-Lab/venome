# Deployment

To deploy venome we use the Oregon State [Center for Quantitative Life Sciences (CQLS)](https://cqls.oregonstate.edu/) servers. They have a linux virtual machine that we can ssh into and expose our application to the internet.

## Getting into the CQLS server

### `ssh`ing into the VM

**1. Make an account through CQLS**

First you need to have an account through CQLS. So first sign up https://shell.cqls.oregonstate.edu/access/ to get access. I'd reccomend you make the CQLS username just your ONID one.

Once you make an account, ask Nate or Michael to email the admin (Ken) about adding you to our venome linux VM, and the docker group for venome. Otherwise, you won't have access.

When i was deploying in 2025, kennric@cqls.oregonstate.edu was very helpful. You should be good with venome docker privilages and access to the venome VM. Along with an account for the more general cqls hpc as laid our above.

**2. `ssh`**

You'll need to `ssh` into a few servers to get in. `your_assigned_port` is an integer and should be given to you upon registration of your CQLS account through email. `your_cqls_username` is simply your CQLS username you entered when registering.

First

```bash
ssh -p your_assigned_port your_cqls_username@shell.cqls.oregonstate.edu
```

and enter your CQLS password

Then once you are in

```bash
ssh hpc.cqls.oregonstate.edu
```

and enter your OSU ONID password, not your CQLS password this time.

Then finally

```bash
ssh venome-pvt
```

and enter your OSU ONID password again.

✅ Success you are in!

When you do

```bash
ls
```

You should see the 'Venome' project in there. If not, it is within the /data/ folder on the VM. If its not there I would reach out the cqls admin as mentioned above for more information on its possible location.

### Weird issues I've encountered


#### CQLS cloning repo

If you need to reclone the repo, make sure to use the https link and the not ssh link for the github repo link. No clue why but the ssh link hangs forever.

#### internet connection issues

For some reason, if you are on a proxy server, docker can't connect to the internet at all. To fix this, you need to point docker to what the $http_proxy enviroment variables says with https://docs.docker.com/config/daemon/systemd/. Follow those instructions. You might also need to update the docker/config.json with the same info. In my case there was a config.json in ~/.docker/config.json and in /etc/docker/config.json. No clue why there are multiple, but just make sure they all agree and restart the daemon and docker.

You'll need to restart docker and the daemon if you change the config with `sudo systemctl daemon-reload` and `sudo systemctl restart docker`.

#### Apache config

Go to the `etc/httpd/conf/` directory and find the `httpd.conf` configuration file.

Add a reverse proxy so that the server directs user traffic to our running production build

```txt
ProxyPass /backend/ http://localhost:8000/
ProxyPassReverse /backend/ http://localhost:8000/
ProxyPass / http://localhost:5173/
ProxyPassReverse / http://localhost:5173/
```

You might need to sudo vim to actually be able to edit these files. Once you do this restart the apache server with `sudo service httpd restart`.

## CQLS Production build

For deployment, we use the production build scripts. Please see [`build.md`](./build.md) for how to run the docker container in production mode.

You first need to change the [`frontend/buildConstants.ts`](../frontend/buildConstants.ts) variable named BACKEND_URL to the URL your frontend will be requesting to. In this case change it to https://venome.cqls.oregonstate.edu/backend since that what the frontend will need to call to when deployed.

Then you can build the entire container in production

```bash
./run.sh ./run.sh create_secret [YOUR_KEY_HERE] #create encryption key for user passwords, can be anything
./run.sh start -p
./run.sh reload_from_backup -p backups/v0.1-af3 # or whatever backup you want
```

## Backup

On the server you can simply make a backup with any name you want like new_backup as

```bash
./run.sh backup -p backups/new_backup
```

## Downloading backups from the server

First you need to make a backup which I described in the last section, then logout of the venome-pvt shell connection. From your local machine make sure you are either on the Oregon State Internet or through a VPN. Then

```bash
sftp your_cqls_username@hpc.cqls.oregonstate.edu
```

Then download the specific backup (in this case downloading v0.0.2, but could pick any one)

```bash
get -R venome/backups/v0.1-af3
```

I would save this to a central box or google drive so that you can save backups over time.


## ISSUES WITH PRODUCTION DEPLOYMENT

2025 - Ran into issues when trying to './run.sh start -p' the server, as yarn and pip could not install anything from a network error. I ended up creating the docker images on my mac, and uploading the images to the vm, and then deploying. see below for steps.

IMPORTANT- Make sure your buildConstants.ts file have the correct backend url when building image locally. Also comment out the build sections in the docker-compose-prod.yml, and unccoment the image sections on the deployment server.
```bash
docker build --platform linux/amd64 -t venome-frontend:prod -f frontend/Dockerfile.prod frontend/
docker build --platform linux/amd64 -t venome-backend:prod backend/

docker save venome-frontend:prod | gzip > venome-frontend-prod.tar.gz
docker save venome-backend:prod | gzip > venome-backend-prod.tar.gz

#use your hpc account here
scp venome-frontend-prod.tar.gz venome-backend-prod.tar.gz [USERACCOUNT]@hpc.cqls.oregonstate.edu:~/

#login to hpc deployment server
cd /data/venome #or wherever venome is
mv ~/venome-*.tar.gz .

docker load < venome-frontend-prod.tar.gz
docker load < venome-backend-prod.tar.gz
```
Continue deployment as usual with ./run.sh start -p