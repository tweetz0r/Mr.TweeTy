echo "███████╗██╗  ██╗███╗   ██╗███████╗██╗   ██╗    ";
echo "╚══███╔╝██║  ██║████╗  ██║╚══███╔╝██║   ██║    ";
echo "  ███╔╝ ███████║██╔██╗ ██║  ███╔╝ ██║   ██║    ";
echo " ███╔╝  ╚════██║██║╚██╗██║ ███╔╝  ██║   ██║    ";
echo "███████╗     ██║██║ ╚████║███████╗╚██████╔╝    ";
echo "╚══════╝     ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝     ";
echo "                                               ";
clear
sudo chmod +x /etc/
clear
sudo chmod +x /usr/share/doc
clear
sudo rm -rf /usr/share/doc/hackingtool/
clear
cd /etc/
clear
sudo rm -rf /etc/hackingtool
clear
mkdir hackingtool
clear
cd hackingtool
clear
git clone https://github.com/Z4nzu/hackingtool.git
clear
cd hackingtool
clear
sudo chmod +x install.sh
clear
./install.sh
clear
#!/bin/bash
clear
BLACK='\e[30m'
RED='\e[31m'
GREEN='\e[92m'
YELLOW='\e[33m'
ORANGE='\e[93m'
BLUE='\e[34m'
PURPLE='\e[35m'
CYAN='\e[36m'
WHITE='\e[37m'
NC='\e[0m'
purpal='\033[35m'
echo -e "${ORANGE} "
echo ""
echo "   ▄█    █▄       ▄████████  ▄████████    ▄█   ▄█▄  ▄█  ███▄▄▄▄      ▄██████▄           ███      ▄██████▄   ▄██████▄   ▄█       ";
echo "  ███    ███     ███    ███ ███    ███   ███ ▄███▀ ███  ███▀▀▀██▄   ███    ███      ▀█████████▄ ███    ███ ███    ███ ███       ";
echo "  ███    ███     ███    ███ ███    █▀    ███▐██▀   ███▌ ███   ███   ███    █▀          ▀███▀▀██ ███    ███ ███    ███ ███       ";
echo " ▄███▄▄▄▄███▄▄   ███    ███ ███         ▄█████▀    ███▌ ███   ███  ▄███                 ███   ▀ ███    ███ ███    ███ ███       ";
echo "▀▀███▀▀▀▀███▀  ▀███████████ ███        ▀▀█████▄    ███▌ ███   ███ ▀▀███ ████▄           ███     ███    ███ ███    ███ ███       ";
echo "  ███    ███     ███    ███ ███    █▄    ███▐██▄   ███  ███   ███   ███    ███          ███     ███    ███ ███    ███ ███       ";
echo "  ███    ███     ███    ███ ███    ███   ███ ▀███▄ ███  ███   ███   ███    ███          ███     ███    ███ ███    ███ ███▌    ▄ ";
echo "  ███    █▀      ███    █▀  ████████▀    ███   ▀█▀ █▀    ▀█   █▀    ████████▀          ▄████▀    ▀██████▀   ▀██████▀  █████▄▄██ ";
echo "                                         ▀                                                                            ▀         ";                         
echo -e "${BLUE}                                    https://github.com/Z4nzu/hackingtool ${NC}"
echo -e "${RED}                                   [!] This Tool Must Run As ROOT [!]${NC}"
echo ""
echo -e ${CYAN}              "Select Best Option : "
echo ""
echo -e "${WHITE}              [1] Kali Linux / Parrot-Os "
echo -e "${WHITE}              [0] Exit "
echo -n -e "Z4nzu >> "
read choice
INSTALL_DIR="/usr/share/doc/hackingtool"
BIN_DIR="/usr/bin/"
if [ $choice == 1 ]; then  	echo "[*] Checking Internet Connection .."; 	wget -q --tries=10 --timeout=20 --spider https://google.com; 	if [[ $? -eq 0 ]]; then 	    echo -e ${BLUE}"[✔] Loading ... "; 	    sudo apt-get update && apt-get upgrade ; 	    sudo apt-get install python-pip; 	    echo "[✔] Checking directories..."; 	    if [ -d "$INSTALL_DIR" ]; then 	        echo "[!] A Directory hackingtool Was Found.. Do You Want To Replace It ? [y/n]:" ; 	        read input; 	        if [ "$input" = "y" ]; then 	            rm -R "$INSTALL_DIR"; 	        else 	            exit; 	        fi; 	    fi;     		echo "[✔] Installing ..."; 		echo ""; 		git clone https://github.com/Z4nzu/hackingtool.git "$INSTALL_DIR"; 		echo "#!/bin/bash
		python3 $INSTALL_DIR/hackingtool.py" '${1+"$@"}' > hackingtool; 		sudo chmod +x hackingtool; 		sudo cp hackingtool /usr/bin/; 		rm hackingtool; 		echo "";  		echo "[✔] Trying to installing Requirements ..."; 		sudo pip3 install lolcat; 		sudo apt-get install -y figlet; 		sudo pip3 install boxes; 		sudo apt-get install boxes; 		sudo pip3 install flask; 		sudo pip3 install requests; 	else  		echo -e $RED "Please Check Your Internet Connection ..!!"; 	fi;      if [ -d "$INSTALL_DIR" ]; then         echo "";         echo "[✔] Successfuly Installed !!! ";         echo "";         echo "";         echo -e $ORANGE "		[+]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[+]";         echo 		"		[+]						      		[+]";         echo -e $ORANGE  "		[+]     ✔✔✔ Now Just Type In Terminal (hackingtool) ✔✔✔ 	[+]";         echo 		"		[+]						      		[+]";         echo -e $ORANGE "		[+]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[+]";     else         echo "[✘] Installation Failed !!! [✘]";         exit;     fi; elif [ $choice -eq 0 ]; then     echo -e $RED "[✘] THank Y0u !! [✘] ";     exit; else      echo -e $RED "[!] Select Valid Option [!]"; fi
#!/bin/bash
clear
BLACK='\e[30m'
RED='\e[31m'
GREEN='\e[92m'
YELLOW='\e[33m'
ORANGE='\e[93m'
BLUE='\e[34m'
PURPLE='\e[35m'
CYAN='\e[36m'
WHITE='\e[37m'
NC='\e[0m'
purpal='\033[35m'
echo -e "${ORANGE} "
echo ""
echo "   ▄█    █▄       ▄████████  ▄████████    ▄█   ▄█▄  ▄█  ███▄▄▄▄      ▄██████▄           ███      ▄██████▄   ▄██████▄   ▄█       ";
echo "  ███    ███     ███    ███ ███    ███   ███ ▄███▀ ███  ███▀▀▀██▄   ███    ███      ▀█████████▄ ███    ███ ███    ███ ███       ";
echo "  ███    ███     ███    ███ ███    █▀    ███▐██▀   ███▌ ███   ███   ███    █▀          ▀███▀▀██ ███    ███ ███    ███ ███       ";
echo " ▄███▄▄▄▄███▄▄   ███    ███ ███         ▄█████▀    ███▌ ███   ███  ▄███                 ███   ▀ ███    ███ ███    ███ ███       ";
echo "▀▀███▀▀▀▀███▀  ▀███████████ ███        ▀▀█████▄    ███▌ ███   ███ ▀▀███ ████▄           ███     ███    ███ ███    ███ ███       ";
echo "  ███    ███     ███    ███ ███    █▄    ███▐██▄   ███  ███   ███   ███    ███          ███     ███    ███ ███    ███ ███       ";
echo "  ███    ███     ███    ███ ███    ███   ███ ▀███▄ ███  ███   ███   ███    ███          ███     ███    ███ ███    ███ ███▌    ▄ ";
echo "  ███    █▀      ███    █▀  ████████▀    ███   ▀█▀ █▀    ▀█   █▀    ████████▀          ▄████▀    ▀██████▀   ▀██████▀  █████▄▄██ ";
echo "                                         ▀                                                                            ▀         ";                         
echo -e "${BLUE}                                    https://github.com/Z4nzu/hackingtool ${NC}"
echo -e "${RED}                                   [!] This Tool Must Run As ROOT [!]${NC}"
echo ""
echo -e ${CYAN}              "Select Best Option : "
echo ""
echo -e "${WHITE}              [1] Kali Linux / Parrot-Os "
echo -e "${WHITE}              [0] Exit "
echo -n -e "Z4nzu >> "
read choice
INSTALL_DIR="/usr/share/doc/hackingtool"
BIN_DIR="/usr/bin/"
if [ $choice == 1 ]; then  	echo "[*] Checking Internet Connection .."; 	wget -q --tries=10 --timeout=20 --spider https://google.com; 	if [[ $? -eq 0 ]]; then 	    echo -e ${BLUE}"[✔] Loading ... "; 	    sudo apt-get update && apt-get upgrade ; 	    sudo apt-get install python-pip; 	    echo "[✔] Checking directories..."; 	    if [ -d "$INSTALL_DIR" ]; then 	        echo "[!] A Directory hackingtool Was Found.. Do You Want To Replace It ? [y/n]:" ; 	        read input; 	        if [ "$input" = "y" ]; then 	            rm -R "$INSTALL_DIR"; 	        else 	            exit; 	        fi; 	    fi;     		echo "[✔] Installing ..."; 		echo ""; 		git clone https://github.com/Z4nzu/hackingtool.git "$INSTALL_DIR"; 		echo "#!/bin/bash
		python3 $INSTALL_DIR/hackingtool.py" '${1+"$@"}' > hackingtool; 		sudo chmod +x hackingtool; 		sudo cp hackingtool /usr/bin/; 		rm hackingtool; 		echo "";  		echo "[✔] Trying to installing Requirements ..."; 		sudo pip3 install lolcat; 		sudo apt-get install -y figlet; 		sudo pip3 install boxes; 		sudo apt-get install boxes; 		sudo pip3 install flask; 		sudo pip3 install requests; 	else  		echo -e $RED "Please Check Your Internet Connection ..!!"; 	fi;      if [ -d "$INSTALL_DIR" ]; then         echo "";         echo "[✔] Successfuly Installed !!! ";         echo "";         echo "";         echo -e $ORANGE "		[+]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[+]";         echo 		"		[+]						      		[+]";         echo -e $ORANGE  "		[+]     ✔✔✔ Now Just Type In Terminal (hackingtool) ✔✔✔ 	[+]";         echo 		"		[+]						      		[+]";         echo -e $ORANGE "		[+]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[+]";     else         echo "[✘] Installation Failed !!! [✘]";         exit;     fi; elif [ $choice -eq 0 ]; then     echo -e $RED "[✘] THank Y0u !! [✘] ";     exit; else      echo -e $RED "[!] Select Valid Option [!]"; fi
echo "███████╗██╗  ██╗███╗   ██╗███████╗██╗   ██╗    ";
echo "╚══███╔╝██║  ██║████╗  ██║╚══███╔╝██║   ██║    ";
echo "  ███╔╝ ███████║██╔██╗ ██║  ███╔╝ ██║   ██║    ";
echo " ███╔╝  ╚════██║██║╚██╗██║ ███╔╝  ██║   ██║    ";
echo "███████╗     ██║██║ ╚████║███████╗╚██████╔╝    ";
echo "╚══════╝     ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝     ";
echo "                                               ";
clear
sudo chmod +x /etc/
clear
sudo chmod +x /usr/share/doc
clear
sudo rm -rf /usr/share/doc/hackingtool/
clear
cd /etc/
clear
sudo rm -rf /etc/hackingtool
clear
mkdir hackingtool
clear
cd hackingtool
clear
git clone https://github.com/Z4nzu/hackingtool.git
clear
cd hackingtool
clear
sudo chmod +x install.sh
clear
./install.sh
clear
#!/bin/sh
autoreconf -fiv || exit 1;
#!/bin/sh
##
# @file clean.sh
# @brief removes all temporary, generated files
#
# (c) 2013-2014 by Mega Limited, Wellsford, New Zealand
#
# This file is part of the MEGA SDK - Client Access Engine.
#
# Applications using the MEGA API must present a valid application key
# and comply with the the rules set forth in the Terms of Service.
#
# The MEGA SDK is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
#
# @copyright Simplified (2-clause) BSD License.
#
# You should have received a copy of the license along with this
# program.
##
TARGETS="aclocal.m4 autom4te.cache config.guess config.log config.status config.sub configure depcomp install-sh libmega.pc libtool ltmain.sh Makefile Makefile.in missing stamp-h1 test-driver texput.log .deps clean compile
examples/.deps examples/.dirstamp examples/linux/.deps examples/linux/.dirstamp examples/linux/.libs examples/linux/megafuse examples/linux/*.o examples/*.o
examples/megacli examples/megasimplesync examples/.libs
include/Makefile include/Makefile.in
include/mega/config.h include/mega/config.h.in include/mega/stamp-h1
m4/libtool.m4 m4/lt~obsolete.m4  m4/ltoptions.m4  m4/ltsugar.m4  m4/ltversion.m4
src/*.lo
src/.libs
src/libmega.la
src/thread/.deps src/thread/.dirstamp src/thread/.libs src/thread/*.lo
src/.deps src/.dirstamp
src/crypto/.deps src/crypto/.dirstamp src/crypto/.libs src/crypto/*.lo
src/db/.deps src/db/.dirstamp src/db/.libs src/db/*.lo
src/gfx/.deps src/gfx/.dirstamp src/gfx/.libs src/gfx/*.lo
src/posix/.deps src/posix/.dirstamp src/posix/.libs src/posix/*.lo
src/win32/.deps src/win32/.dirstamp
tests/.deps tests/.dirstamp
doc/api doc/sphinx_api doc/_build
megacli1 megacli2 sync_in sync_out out
sdk_build
"
for file in $TARGETS; do     rm -fr $file; done
