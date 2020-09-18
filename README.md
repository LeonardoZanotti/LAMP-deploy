<img src="https://miro.medium.com/max/4096/1*6rDcIgFJQldloIERiUSmzw.png" alt="Apache symbol">

# LAMP-deploy
Relatório que explica como realizar o deploy de um projeto utilizando LAMP <br />
How to do project deploy with apache LAMP

## Requirements
Im using only Apache 2.4.29. In distros from Debian it can be installed with:
```bash
$ sudo apt update
$ sudo apt install apache2
```
If you have some problem installing Apache you can visit the [oficial page](https://httpd.apache.org/download.cgi).

## Other requirements
To host a project you obviously need some project. For trainning you can use the `html_test` project in this repository. It was just a random sample with html + css + js.
To get it you can just download this repo or clone it with
```bash
$ git clone https://github.com/LeonardoZanotti/LAMP-deploy.git
```

## Creating the virtual host
First of all, drop the project folder inside **/var/www/html** (you will need root acess) and garant some permissions to the project folder
```bash
# Moving the project inside the folder
$ sudo mv /home/user/path/to/project /var/www/html

# Giving permissions
$ sudo chmod 755 /var/www/html/html_test
```

Now, go to /etc/apache2
```bash
$ cd /etc/apache2
```

In this folder whe have the following
```bash
apache2.conf    conf-enabled  magic           mods-enabled  sites-available
conf-available  envvars       mods-available  ports.conf    sites-enabled
```

* sites-available is the folder where we will configure the project
* sites-enabled is where the hosted sites will stay
* apache2.conf is the apache2 configuration of folders permissions

Lets do some configuration in apache2.conf:
```bash
# Open it with a text editor and root permission (or you may not save the file)
$ sudo nano apache2.conf
```

The file should stay like this
```bash

#
# a lot of confs here
#

<Directory />
	Options FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>

<Directory /usr/share>
	AllowOverride None
	Require all granted
</Directory>

# This will give permissions to all projects inside /var/www/html
<Directory /var/www/html>
	Options Indexes FollowSymLinks Includes ExecCGI
	AllowOverride None
	Require all granted
	Allow from all
</Directory>

#
# more confs here
#
```

**Ctrl + S** to save and **Ctrl + X** to exit the file

Now, lets do the final configuration in **sites-available** folder
```bash
$ cd sites-available/
```

Here we have
```bash
000-default.conf  default-ssl.conf
```

We will make a copy of the default conf file to create our virtual host
```bash
# Create a copy of the default file
$ sudo cp 000-default.conf html_test.conf

# Open this with a text editor
$ sudo nano html_test.conf
```

Inside html_test.conf we will do the host configuration, and the final file will look like this
```bash
<VirtualHost *:80>
	
        ServerName www.htmltestzanotti.com
	ServerAlias htmltestzanotti.com
	ServerAdmin webmaster@localhost
	DocumentRoot /var/www/html/html_test

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

</VirtualHost>
```

Now, we are done with the folders and files configuration, just run the following to put the site online
```bash
# Add the site to the sites-enabled folder
$ sudo a2ensite html_test.conf

# Restart apache2 service, so it can load the sites-enabled folder again
# I never know which one of this three i should use, so you can all .-.
# Apache2 tells which command use
$ systemctl reload apache2
$ systemctl restart apache2
$ service apache2 reload    # Usually this works fine

# If you need to remove the host, you can use this
$ sudo a2dissite html_test.conf
```

And its done, our project is hosted on `localhost`

### Some considerations
The html file should be named as **index.html**. If not, you should declare the main file in the DocumentRoot field inside the .conf file.

If you want to access your virtual host through the ServerName or ServerAlias you should do the following.
**Attention! Your ServerName and ServerAlias couln't exist (so be creative and invent some weird url =D)**
```bash
# Open the hosts manager file
$ sudo nano /etc/hosts

# Add this line
127.0.0.1   www.htmltestzanotti.com
```

**Ctrl + S** to save and **Ctrl + X** to exit the file

Now you can access **www.htmltestzanotti.com** or **htmltestzanotti.com** or just locahost to see your project.

# LeonardoZanotti