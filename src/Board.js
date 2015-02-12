// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    hasAnyDiagonalConflicts: function() {
      var board = this.rows();
      var numberOfSides = 4;
      for (var i = 0; i < numberOfSides; i++) {
        var condensedMatrix = this.rotate45Major(board);
        if (this.hasAnyRowConflicts(condensedMatrix)) {
          return true;
        }
        board = this.rotate90(board);
      }

      return false;
    },

    rotate45Major: function(board) {
      var board = board || this.rows();
      var outer = [];
      for(var i = 0; i < board.length; i++) {
        var inner = [];
        for(var j = 0; j < board[i].length; j++) {
          inner.push(board[j][j + i]);
        }
        outer.push(inner);
      }
      return outer;
    },

    rotate45Minor: function(board) {
      var board = board || this.rows();
      var outer = [];
      for(var i = 0; i < board.length; i++) {
        var inner = [];
        for(var j = board[i].length - 1, k = 0; j >= 0; j--, k++) {
          inner.push(board[k][j - i]);
        }
        outer.push(inner);
      }
      return outer;
    },

    rotate90: function(board) {
      var temp = _.zip.apply(_.zip, board);
      return temp;
    },
    hasRowConflictAt: function(row) {
     var count = 0;
     for(var i = 0; i < row.length; i++) {
       if (row[i] === 1) {
         count++;
       }
     }
    return count > 1;
    },

    hasAnyRowConflicts: function(board) {
      board = board || this.rows();
      for(var i = 0; i < board.length; i++) {
        if(this.hasRowConflictAt(board[i])) {
          return true;
        }
      }
      return false;
    },

    hasColConflictAt: function(colIndex) {
      return false;
    },

    hasAnyColConflicts: function() {
      var rotated = this.rotate90(this.rows());
      return this.hasAnyRowConflicts(rotated);
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      return this.hasAnyDiagonalConflicts(); // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      return this.hasAnyDiagonalConflicts();
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(index) {
      var counter = 0;
      var board = this.rows();
      for (var i = n + (n - 1);i >= 0;i--, index++) {
        if (board[i][index] === 1 && index > 0 && index < n)
      }
      return counter > 1;
    },

    // test if any minor diagonals on this (board) contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.get('n');
      for (var i = 0;i < n;i++) {
        if (this.hasMinorDiagnolConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };
}());


window.board = new Board([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 1, 0, 0]
    ]);
