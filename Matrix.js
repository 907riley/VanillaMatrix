class Matrix {
    constructor(rows, cols, mode, matrix) {
        this.rows = rows;
        this.cols = cols;
        this.mode = mode;
        this.matrix = matrix;
        this.solutions_array = new Array(rows);
        this.determinant_solution = 0;
        console.log(`in constructor rows ${rows} and matrix ${matrix}`);
    }

    calculate() {
        switch (this.mode) {
            case "linear":
                this.gaussianElimination();
                console.log(this.solutions_array);
                break;
            case "determinant":
                this.calculateDeterminant();
                console.log(this.determinant_solution);
                break;
            case "inverse":
                this.calculateInverse();
                console.log(this.matrix);
                break;
            default:
                console.log("no mode match");
                break;
        }
    }

    swap(r1, c1, r2, c2) {
        let swaps = false;
        // checking to avoid out of bounds
        if (r1 >= this.rows || r2 >= this.rows || c1 >= this.cols || c2 >= this.cols) {
            return swaps;
        }

        // check to make sure the values being swapped aren't equal
        if (matrix[r1][c1] != matrix[r2][c2]) {
            let temp = matrix[r1][c1];
            matrix[r1][c1] = matrix[r2][c2];
            matrix[r2][c2] = temp;
            swaps = true;
        }

        return swaps;
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

    calculateDeterminant() {
        let n = this.rows;
        let swap_count = 0;
        let swaps = false;
        // go through each row
        for (let i = 0; i < n - 1; ++i) {
            swaps = false;
            // attempting to find the row with the greatest value at the current column
            // this is to fix the issue of dividing by 0 when the rows aren't in the best order already
            let pivot_row = i;
            for (let j = i + 1; j < n; ++j) {
                //System.out.println("second loop");
                if (Math.abs(this.matrix[j][i]) > Math.abs(this.matrix[pivot_row][i])) {
                    pivot_row = j;
                }
            }
            for (let k = i; k < n; ++k) {
                swaps = this.swap(i, k, pivot_row, k);
            }

            for (let j = i + 1; j < n; ++j) {
                // get the value to make two rows cancel out when multiplied
                let temp = this.matrix[j][i]/this.matrix[i][i];
                // go through and actually perform the gaussian elimination by solving the set of equations
                for (let k = i; k < n; ++k) {
                    this.matrix[j][k] = this.matrix[j][k] - this.matrix[i][k] * temp;
                }
            }

            if (swaps) {
                ++swap_count;
            }
        }

        // actually calculating the determinant value
        this.determinant_solution += this.matrix[0][0];
        for (let i = 1; i < this.rows; ++i) {
            this.determinant_solution *= this.matrix[i][i];
        }

        // accounting for row swaps that require a sign flip
        if (swap_count % 2 == 1) {
            this.determinant_solution *= -1;
        }
        this.determinant_solution = Math.round(this.determinant_solution);
    }

    calculateInverse() {
        
        // getting the rows in the correct order
        for (let i = this.rows - 1; i > 0; --i) {
            if (matrix[i - 1][0] < matrix[i][0]) {
                for (let j = 0; j < 2 * this.rows; ++j) {
                    // check to make sure the values being swapped aren't equal
                    if (matrix[i - 1][j] != matrix[i][j]) {
                        let temp = matrix[i - 1][j];
                        matrix[i - 1][j] = matrix[i][j];
                        matrix[i][j] = temp;
                    }
                }
            }
        }

        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.rows; ++j) {
                if (i != j) {
                    let temp = matrix[j][i] / matrix[i][i];
                    for (let k = 0; k < 2 * this.rows; ++k) {
                        matrix[j][k] = matrix[j][k] - matrix[i][k] * temp;
                    }
                }
            }
        }

        for (let i = 0; i < this.rows; ++i) {
            let temp = matrix[i][i];
            for (let j = 0; j < 2 * this.rows; ++j) {
                matrix[i][j] = matrix[i][j] / temp;
            }
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