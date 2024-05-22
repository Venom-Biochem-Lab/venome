# Deployment

To deploy venome we use the Oregon State [Center for Quantitative Life Sciences (CQLS)](https://cqls.oregonstate.edu/) servers. They have a linux virtual machine that we can ssh into and expose our application to the internet.

## Getting into the CQLS server

### `ssh`ing into the VM

**1. Make an account through CQLS**

First you need to have an account through CQLS. So first sign up https://shell.cqls.oregonstate.edu/access/ to get access. I'd reccomend you make the CQLS username just your ONID one.

Once you make an account, ask Nate or Michael to email the admin (Ken) about adding you to our venome linux VM. Otherwise, you won't have access.

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

### Weird issues I've encountered

#### CQLS cloning repo

If you need to reclone the repo, make sure to use the https link and the not ssh link for the github repo link. No clue why but the ssh link hangs forever.

#### Proxy server

For some reason, if you are on a proxy server, docker can't connect to the internet at all. To fix this, you need to point docker to what the $http_proxy enviroment variables says with https://docs.docker.com/config/daemon/systemd/. Follow those instructions. You might also need to update the docker/config.json with the same info. In my case there was a config.json in ~/.docker/config.json and in /etc/docker/config.json. No clue why there are multiple, but just make sure they all agree and restart the daemon and docker. 

You'll need to restart docker and the daemon if you change the config with `sudo systemctl daemon-reload` and `sudo systemctl restart docker`.

#### Apache config

I'm still having issue with the config. Update when I get things working.


## Production build

For deployment, we use the production build scripts. Please see [`build.md`](./build.md) for how to run the docker container in production mode.