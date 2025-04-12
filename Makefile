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

dev:     # run api // http://localhost:3000/api-docs/S
	@npm run dev

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
	