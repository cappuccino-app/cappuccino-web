var cappuccinoWebClient = angular.module('cappuccinoWebClient', ['Commands'])
    .controller('controller', ['$scope', '$http', 'CommandsService', function($scope, $http, $CommandsService) {
        $scope.command = "ls";
        $scope.currentDir = "/";
        $scope.homePage = false;
        $showUploadForm = false;
        $scope.files = {};
        $scope.allowed_commands = ["ls", "cp", "mv", "dw", "up", "find"];

        /*
         * This function sends different command requests to the Server by sending a GET
         * request to /command/ API entry point through our custom Angular module CommandsService
         */
        $scope.sendCommandRequest = function(command) {
            console.log("$scope.command = " + $scope.command);

            /* Case Download */
            if ($scope.command.startsWith("dw")) {
                location.replace('/download/?command=' + $scope.command + '&currentDir=' + $scope.currentDir);
            }/* Case Upload */
            else if ($scope.command.startsWith("up")) {
                $showUploadForm = true;
                return;
            }/* Case Listing Files and Directory = ls command */
            else if ($scope.command.startsWith("ls")) {
                $CommandsService.ls($scope.command, $scope.currentDir).then(function(data) {
                    var output = [];
                    for (i = 0; i < data.data.length; i++) {
                        output.push(data.data[i]);
                    }
                    $scope.files = data.data['data'];
                    console.log('$scope.files --> ' + JSON.stringify($scope.files));
                });
                return;
            } /* Case Find */
            else if ($scope.command.startsWith("find")) {
                // coming soon
            } else { /* Case Other Commands (among the allowed ones) */
                var commandName = "";
                if ($scope.command.indexOf(' ') != -1)
                    commandName = $scope.command.split(' ')[0];

                /* Verify that the command is allowed */
                if (1 > 0) {
                    console.log("Sending Command : " + $scope.command);
                    $http.get("/command/", {
                            params: {
                                "command": $scope.command,
                                "currentDir": $scope.currentDir,
                            }
                        })
                        .success(function(data, status, headers, config) {
                            if (data["type"] == "1") {
                                console.log("Error: " + data["message"]);
                            } else(data["type"] == "0")
                            console.log("Ok Success: " + data["message"]);

                        })
                        .error(function(data, status, headers, config) {
                            console.log("-ERR Communication With Server");
                        });
                }
            }
        }

        /*
         * This function allows navigating through directories: when clicking on one of the entries showed in the main
         * file manager view, if that is a directory, the client sends an 'ls command' to the server to virtually open the directory
         */
        $scope.lsCommandRequestOnClick = function(event) {
            var event_target = event.target;
            var clicked_row = $(event_target).parent();
            var clicked_row = $(clicked_row).children()[0];
            console.log($(clicked_row).text());
            $scope.command = "ls " + $(clicked_row).text();
            this.sendCommandRequest($scope.command);
        }

        /* This function sends a command to the server when clicking on the 'exec' button on the right part of the search bar */
        $scope.sendBarCommandRequest = function() {
            console.log("COMMAND : " + $scope.command);
            $scope.sendCommandRequest($scope.command);
        }

        /* home page directory file listing */
        if ($scope.homePage == false) {
            $scope.sendCommandRequest("ls");
            $scope.homePage = true;
        }
    }]);
