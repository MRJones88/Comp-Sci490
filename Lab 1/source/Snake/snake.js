angular.module('Snake', [])
    .controller('snakeCtrl', function($scope, $timeout, $window) {
        //board constants
        const SIZE = 20;

        const STYLE = {
            GAME_OVER: '#445859',
            TARGET: '#E26758',
            HEAD: '#396F7A',
            BODY: '#CCF8C7',
            BOARD: '#88B3BA'
        };

        //setup enums
        let fruit = {
            x: -1,
            y: -1
        };

        const KEY_DIRECTIONS = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };

        let snake = {
            direction: KEY_DIRECTIONS.LEFT,
            parts: [{
                x: -1,
                y: -1
            }]
        };

        let interval, isGameOver, tempDirection;

        $scope.bestScore = 0;
        $scope.score = 0;

        //used by ng-style to style the board
        $scope.setStyling = function(col, row) {
            if (isGameOver)  {
                return STYLE.GAME_OVER;
            } else if (fruit.x == row && fruit.y == col) {
                return STYLE.TARGET;
            } else if (snake.parts[0].x == row && snake.parts[0].y == col) {
                return STYLE.HEAD;
            } else if ($scope.board[col][row] === true) {
                return STYLE.BODY;
            }
            return STYLE.BOARD;
        };

        //updates states
        function updateBoard() {
            const newHead = getHead();

            if (boardCrash(newHead) || selfCrash(newHead)) {
                return gameOver();
            } else if (fruitCrash(newHead)) {
                eatTarget();
            }

            // Remove tail
            const oldTail = snake.parts.pop();
            $scope.board[oldTail.y][oldTail.x] = false;

            // Pop tail to head
            snake.parts.unshift(newHead);
            $scope.board[newHead.y][newHead.x] = true;

            // Do it again
            snake.direction = tempDirection;
            $timeout(updateBoard, interval);
        }

        function getHead() {
            const newHead = angular.copy(snake.parts[0]);

            // Update Location
            if (tempDirection === KEY_DIRECTIONS.LEFT) {
                newHead.x -= 1;
            } else if (tempDirection === KEY_DIRECTIONS.RIGHT) {
                newHead.x += 1;
            } else if (tempDirection === KEY_DIRECTIONS.UP) {
                newHead.y -= 1;
            } else if (tempDirection === KEY_DIRECTIONS.DOWN) {
                newHead.y += 1;
            }
            return newHead;
        }

        //check for collisions
        function boardCrash(part) {
            return part.x === SIZE || part.x === -1 || part.y === SIZE || part.y === -1;
        }

        function selfCrash(part) {
            return $scope.board[part.y][part.x] === true;
        }

        function fruitCrash(part) {
            return part.x === fruit.x && part.y === fruit.y;
        }

        function resetTarget() {
            const x = Math.floor(Math.random() * SIZE);
            const y = Math.floor(Math.random() * SIZE);

            if ($scope.board[y][x] === true) {
                return resetTarget();
            }
            fruit = {x: x, y: y};
        }

        function eatTarget() {
            $scope.score++;

            // Grow by 1
            const tail = angular.copy(snake.parts[snake.parts.length - 1]);
            snake.parts.push(tail);
            resetTarget();

            if ($scope.score % 5 === 0) {
                interval -= 15;
            }
        }

        function gameOver() {
            isGameOver = true;

            if ($scope.score > $scope.bestScore) {
                $scope.bestScore = $scope.score;
            }

            $timeout(function() {
                isGameOver = false;
            },500);

            setup();
        }

        function setup() {
            $scope.board = [];
            for (let i = 0; i < SIZE; i++) {
                $scope.board[i] = [];
                for (let j = 0; j < SIZE; j++) {
                    $scope.board[i][j] = false;
                }
            }
        }
        setup();

        $scope.startGame = function() {
            $scope.score = 0;
            snake = {direction: KEY_DIRECTIONS.LEFT, parts: []};
            tempDirection = KEY_DIRECTIONS.LEFT;
            isGameOver = false;
            interval = 150;

            // Set up initial snake
            for (let i = 0; i < 5; i++) {
                snake.parts.push({x: 10 + i, y: 10});
            }
            resetTarget();
            updateBoard();
        };

        $window.addEventListener("keyup", function(event) {
            if (event.keyCode === KEY_DIRECTIONS.LEFT && snake.direction !== KEY_DIRECTIONS.RIGHT) {
                tempDirection = KEY_DIRECTIONS.LEFT;
            } else if (event.keyCode === KEY_DIRECTIONS.UP && snake.direction !== KEY_DIRECTIONS.DOWN) {
                tempDirection = KEY_DIRECTIONS.UP;
            } else if (event.keyCode === KEY_DIRECTIONS.RIGHT && snake.direction !== KEY_DIRECTIONS.LEFT) {
                tempDirection = KEY_DIRECTIONS.RIGHT;
            } else if (event.keyCode === KEY_DIRECTIONS.DOWN && snake.direction !== KEY_DIRECTIONS.UP) {
                tempDirection = KEY_DIRECTIONS.DOWN;
            }
        });
    });