class Matrix {
    constructor(rows, cols, mode, matrix) {
        this.rows = rows;
        this.cols = cols;
        this.mode = mode;
        this.matrix = matrix;
        this.solutions_array = new Array(rows);
        console.log(`in constructor rows ${rows} and matrix ${matrix}`);
    }

    calculate() {
        switch (this.mode) {
            case "linear":
                this.gaussianElimination();
                break;
            case "determinant":
                break;
            case "inverse":
                break;
            default:
                console.log("no mode match");
                break;
        }
    }

    swap(r1, c1, r2, c2) {
        // checking to avoid out of bounds
        if (r1 >= this.rows || r2 >= this.rows || c1 >= this.cols || c2 >= this.cols) {
            return;
        }

        // check to make sure the values being swapped aren't equal
        if (matrix[r1][c1] != matrix[r2][c2]) {
            let temp = matrix[r1][c1];
            matrix[r1][c1] = matrix[r2][c2];
            matrix[r2][c2] = temp;
        }

    }

    rowSwap(r1, r2) {
        for (let i = 0; i < this.cols; i++) {
            this.swap(r1, i, r2, i);
        }
    }

    colSwap(c1, c2) {
        for (let i = 0; i < this.rows; i++) {
            this.swap(i, c1, i, c2);
        }
    }

    backTracking() {
        // for each row, starting at the bottom row
        for (let i = this.rows - 1; i >= 0; --i) {
            //System.out.println("in backtracking");
            let count = 0;
            // this holds the changing constant value
            let compounding_coefficient = matrix[i][this.cols - 1];
            // for each column that needs to be subtracted from the constant before dividing the constant by
            // the current column value
            for (let j = i + 1; j < this.cols - 1; ++j ) {
                compounding_coefficient = compounding_coefficient - matrix[i][j] * this.solutions_array[i + 1 + count];
                //System.out.println("Comp_Co: " + compounding_coefficient);
                ++count;
            }

            // divide the compounded number by the coefficient of the variable we're solving for
            let answer = compounding_coefficient/matrix[i][i];
            answer = Math.round(answer);
            // put the value into the solutions array
            this.solutions_array[i] = answer;
        }
    }

    gaussianElimination() {
        // go through each row
        for (let i = 0; i < this.rows - 1; ++i) {
            // attempting to find the row with the greatest value at the current column
            // this is to fix the issue of dividing by 0 when the rows aren't in the best order already
            let pivot_row = i;
            for (let j = i + 1; j < this.rows; ++j) {
                if (Math.abs(matrix[j][i]) > Math.abs(matrix[pivot_row][i])) {
                    pivot_row = j;
                }
            }
            for (let k = i; k <= this.rows; ++k) {
                this.swap(i, k, pivot_row, k);
            }
            for (let j = i + 1; j < this.rows; ++j) {
                // get the value to make two rows cancel out when multiplied
                let temp = matrix[j][i]/matrix[i][i];
                // go through and actually perform the gaussian elimination by solving the set of equations
                for (let k = i; k <= this.rows; ++k) {
                    matrix[j][k] = matrix[j][k] - matrix[i][k] * temp;
                }
            }
        }
        // backtrack to find the solutions
        this.backTracking();
    }

}