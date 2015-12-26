#!/usr/bin/env bash

#apt-get update

#apt-get install -qy nginx php5 php5-fpm php5-gd php5-cgi php5-cli php5-curl

#install dependencies and other dev libraries
#apt-get install -qy build-essential curl git libssl-dev ruby1.9.3

#Enable nodesource repo so we can get newer versions of nodejs
#curl -sL https://deb.nodesource.com/setup | sudo bash -
#Install nodejs
#apt-get install -qy nodejs
#Install grunt command line tool
#npm install -g grunt-cli

echo "Installing Appfog…"
#gem install eventmachine --no-ri --no-rdoc
#gem install af --no-ri --no-rdoc

echo "Moving nginx config files into place…"
rm /etc/nginx/sites-enabled/default
cp /vagrant/vagrant/nginx/default.conf /etc/nginx/sites-enabled/
cp /vagrant/vagrant/nginx/dummy.* /etc/nginx/

echo "Moving php config files into place…"
#mv /etc/php5/fpm/php.ini /etc/php5/fpm/php.ini.default
#cp /vagrant/php/php.ini /etc/php5/fpm/php.ini

echo "Starting services…"
service nginx restart
service php5-fpm restart
