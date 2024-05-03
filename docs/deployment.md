# Deployment

To deploy venome we use the Oregon State [Center for Quantitative Life Sciences (CQLS)](https://cqls.oregonstate.edu/) servers. They have a linux virtual machine that we can ssh into and expose our application to the internet.

## `ssh`ing into the our VM

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



