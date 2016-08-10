/* Your code here! */
#ifndef MAZE_H
#define MAZE_H

#include <iostream>
#include <vector>
#include <cmath>
#include <map>
#include <utility>
#include <stdlib.h>
#include <time.h>
#include <unordered_map>
#include <stack>
#include "png.h"
#include "dsets.h"
#include "rgbapixel.h"

using namespace std;

class SquareMaze
{
	public:

		/**
		 * Constructor that creates an empty maze
		 */
		SquareMaze();

		/**
		 * Destructor
		 */
		~SquareMaze();

		/**
		 * Copy Constructor
		 */
		SquareMaze(SquareMaze const & other);

		/**
		 * Equals operator
		 */
		SquareMaze const & operator=(SquareMaze const & other);

		/**
		 * Makes the maze
		 */
		void makeMaze(int width, int height);

		/**
		 * Determines if it is possible to travel along a certain path
		 */
		bool canTravel(int x, int y, int dir) const;

		/**
		 * Sets down walls to construct the maze
		 */
		void setWall(int x, int y, int dir, bool exists);

		/**
		 * Returns a vector path of the solution
		 */
		vector<int> solveMaze();

		/**
		 * Draws the maze without the solution
		 */
		PNG* drawMaze() const;

		/**
		 * Draws the maze with the solution path
		 */
		PNG* drawMazeWithSolution();


	private:
		int _width;
		int _height;
		struct wall
		{
			bool bot = true;
			bool right = true;
			bool traversed = false;
			int direction = -1;
			pair<int,int> parent = pair<int,int>(-1,-1);
		};
		wall **maze;

		void clear();
		void copy(SquareMaze const & other);
		void initializeMap(int width, int height, map<pair<int,int>, int> &nodes);
		void DFS(unordered_map<int, vector<int>> &map);
		void getPath(vector<int> &vec);
		void restoreMaze();
		void colorMaze(PNG *& picture) const;
		vector<int> pathToParent(unordered_map<int, vector<int>> & map, int x);
		vector<pair<int,int>> getAdjacent(int x, int y);
};
#endif // MAZE_H