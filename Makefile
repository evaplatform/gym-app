############################################################################### Main
help:	      # This help
	@clear
	@echo ""
	@echo '___________.__  __                                 _____ __________.___ '
	@echo '\_   _____/|__|/  |_  ____   ____   ______ ______ /  _  \\______   \   |'
	@echo ' |    __)  |  \   __\/    \_/ __ \ /  ___//  ___//  /_\  \|     ___/   |'
	@echo ' |     \   |  ||  | |   |  \  ___/ \___ \ \___ \/    |    \    |   |   |'
	@echo ' \___  /   |__||__| |___|  /\___  >____  >____  >____|__  /____|   |___|'
	@echo '     \/                  \/     \/     \/     \/        \/              '
	@echo ""
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*"
############################################################################### Project support

remoteBuildProduction: # build the project remotely | to render internal distribution, set in the eas.json 'distribution: "internal"' instead of buildType
	@read -p "Enter expo message: " message; \
	echo "Building the project remotely..."; \
	eas build -p android --profile production --message "$$message";
	
remoteBuildPreview: # build the project remotely | to render internal distribution, set in the eas.json 'distribution: "internal"' instead of buildType
	@read -p "Enter expo message: " message; \
	echo "Building the project remotely..."; \
	eas build -p android --profile preview --message "$$message";

localBuild: # build the project locally , set "buildType": "apk" in android
	@echo "Building the project locally..."
	@eas build -p android --profile preview --local

setJava: # sdk use java 17.0.12-zulu
	@sdk use java 17.0.12-zulu

buildAndroid: # it should be ran when you change the native code or install new native dependencies
	@npx expo run:android

dev:  # run dev
	@npx expo start --tunnel

devReset: # run dev with reset cache
	@npx expo start --tunnel --reset-cache

commit:
	@read -p "Enter commit message: " message; \
	git add .; \
	git commit -m "$$message"; \
	git push origin main;

startDocker: 
	@docker-compose up -d  

killPort:
	@sudo fuser -k 3000/tcp

format: # format code
	@npm run format

reset: # reset packages
	@rm -rf node_modules/ package-lock.json 
	@npm i
	