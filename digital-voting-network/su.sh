


echo " ********************** ";
echo "$(tput setab 4) Deleting cards if available... $(tput sgr 0)";
composer card delete --card admin@digital-voting-network
echo "$(tput setab 4) if available card was deleted $(tput sgr 0)";
echo " ********************** ";
echo " ";




echo " ********************** ";
echo "$(tput setab 4) Composer network card installing... $(tput sgr 0)";
composer network install --card PeerAdmin@hlfv1 --archiveFile digital-voting-network@0.0.9.bna;
echo "$(tput setab 4) Composer network card installed $(tput sgr 0)";
echo " ********************** ";
echo " ";



echo " ********************** ";
echo "$(tput setab 4) Composer network starting with name bbehr-network... $(tput sgr 0)";
composer network start --networkName digital-voting-network --networkVersion 0.0.9 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card;
echo "$(tput setab 4) Composer network started with name bbehr-network $(tput sgr 0)";
echo " ********************** ";
echo " ";






echo " ********************** ";
echo "$(tput setab 4) Importing composer card... $(tput sgr 0)";
composer card import --file networkadmin.card;
echo "$(tput setab 4) Composer card imported $(tput sgr 0)";
echo " ********************** ";
echo " ";





echo " ********************** ";
echo "$(tput setab 4) Pinging composer card... $(tput sgr 0)";
composer network ping --card admin@digital-voting-network
echo "$(tput setab 4) Card pinged $(tput sgr 0)";
echo " ********************** ";
echo " ";




echo " ********************** ";
echo "$(tput setab 4) Exporting ComposerProviders for github authentication... $(tput sgr 0)";
export COMPOSER_PROVIDERS='{"github":{"provider":"github","module":"passport-github","clientID":"cd192493ed72af606961","clientSecret":"09be9d04efa65e278189981a45fa29a23f53774d","authPath":"/auth/github","callbackURL":"/auth/github/callback","successRedirect":"/","failureRedirect":"/"}}';
echo $COMPOSER_PROVIDERS;
echo "$(tput setab 4) ComposerProviders exported $(tput sgr 0)";
echo " ********************** ";
echo " ";





echo " ********************** ";
echo "$(tput setab 4) Exporting main new admin card and removing old networkadmin card... $(tput sgr 0)";
composer card export -f main_exp.card -c admin@digital-voting-network; rm networkadmin.card
echo "$(tput setab 4) Exported main new admin card and removing old networkadmin card $(tput sgr 0)";
echo " ********************** ";
echo " ";



read -p "Start rest server? " pass
if test "$pass" = "yes"
then
     echo " ********************** ";
     echo "$(tput setab 4) Starting rest server... $(tput sgr 0)";
     composer-rest-server -c admin@digital-voting-network -n never -w true -p 3000 -m true -a true

else
     echo "Access denied."
     echo " ********************** ";
     echo "$(tput setab 4) Not starting rest server... $(tput sgr 0)";	
fi



