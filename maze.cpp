/* Your code here! */
#include "maze.h"

SquareMaze::SquareMaze()
{
	maze = NULL;
	_width = 0;
	_height = 0;
}

SquareMaze::~SquareMaze()
{
	clear();
}

SquareMaze::SquareMaze(SquareMaze const & other)
{
	copy(other);
}

SquareMaze const & SquareMaze::operator=(SquareMaze const & other)
{
	if(this != &other)
	{
		clear();
		copy(other);
	}
	return *this;
}

void SquareMaze::makeMaze(int width, int height)
{
	clear();
	_height = height;
	_width = width;

	DisjointSets set;
	set.addelements(width*height);

	map<pair<int,int>, int> nodes;

	maze = new wall*[height];
	for(int i = 0; i < height; i++)
	{
		maze[i] = new wall[width];
	}


	initializeMap(width, height, nodes);

	int tileSize = 28;
	srand(time(NULL));
	for(int y = 0; y < height; y+=tileSize)
	{
		for(int x = 0; x < width; x+=tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, width); xx++)
				{
					int random = rand() % 2;
					int nodeID = nodes.find(pair<int,int>(xx,yy))->second;
					if((random == 0) && (xx + 1 < width) && (set.find(nodes.find(pair<int,int>(xx+1,yy))->second) !=
						set.find(nodeID)))
					{
						set.setunion(nodeID, nodes.find(pair<int,int>(xx+1,yy))->second);
						setWall(xx, yy, 0, false);
					}
					else if((random == 1) && (yy + 1 < height) && (set.find(nodes.find(pair<int,int>(xx,yy+1))->second) !=
						set.find(nodeID)))
					{
						set.setunion(nodeID, nodes.find(pair<int,int>(xx,yy+1))->second);
						setWall(xx, yy, 1, false);
					}
				}	
			}
		}
	}
	for(int y = 0; y < height; y+=tileSize)
	{
		for(int x = 0; x < width; x+=tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, width); xx++)
				{
					int nodeID = nodes.find(pair<int,int>(xx,yy))->second;
					if((xx + 1 < width) && (set.find(nodes.find(pair<int,int>(xx+1,yy))->second) !=
						set.find(nodeID)))
					{
						set.setunion(nodeID, nodes.find(pair<int,int>(xx+1,yy))->second);
						setWall(xx, yy, 0, false);
					}
					else if((yy + 1 < height) && (set.find(nodes.find(pair<int,int>(xx,yy+1))->second) !=
						set.find(nodeID)))
					{
						set.setunion(nodeID, nodes.find(pair<int,int>(xx,yy+1))->second);
						setWall(xx, yy, 1, false);
					}
				}	
			}
		}
	}
}

bool SquareMaze::canTravel(int x, int y, int dir) const
{
	//dir = 0 = right
	//dir = 1 = down
	//dir = 2 = left
	//dir = 3 = up

	if(dir == 0 && x + 1 < _width && !maze[y][x].right)
	{
		return true;
	}
	else if(dir == 1 && y + 1 < _height && !maze[y][x].bot)
	{
		return true;
	}
	else if(dir == 2 && x - 1 >= 0 && !maze[y][x-1].right)
	{
		return true;
	}
	else if(dir == 3 && y - 1 >= 0 && !maze[y-1][x].bot)
	{
		return true;
	}
	return false;
}

void SquareMaze::setWall(int x, int y, int dir, bool exists)
{
	if(x < 0 || x >= _width || y < 0 || y >= _height) return;
	if(dir == 0)
	{
		maze[y][x].right = exists;
	}
	else if(dir == 1)
	{
		maze[y][x].bot = exists;
	}
}

vector<int> SquareMaze::solveMaze()
{
	vector<int> path;
	getPath(path);
	//cout << path.size() << endl;
	return path;
}

PNG* SquareMaze::drawMaze() const
{
	int picWidth = _width * 20 + 1;
	int picHeight = _height * 20 + 1;
	PNG * picture = new PNG(picWidth, picHeight);
	colorMaze(picture);

	for(int x = 0; x < picWidth; x++)
	{
		(*picture)(x,0)->red = 0;
		(*picture)(x,0)->blue = 0;
		(*picture)(x,0)->green = 153;
	}

	for(int y = 0; y < picHeight; y++)
	{
		(*picture)(0,y)->red = 0;
		(*picture)(0,y)->blue = 0;
		(*picture)(0,y)->green = 153;
	}

	int tileSize = 28;

	for(int y = 0; y < _height; y+= tileSize)
	{
		for(int x = 0; x < _width; x+= tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, _height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, _width); xx++)
				{
					if(maze[yy][xx].right)
					{
						for(int k = 0; k <= 20; k++)
						{
							(*picture)((xx+1)*20, yy*20+k)->red = 0;
							(*picture)((xx+1)*20, yy*20+k)->blue = 0;
							(*picture)((xx+1)*20, yy*20+k)->green = 153;
						}
					}
					if(maze[yy][xx].bot)
					{
						for(int k = 0; k <= 20; k++)
						{
							(*picture)(xx*20+k, (yy+1)*20)->red = 0;
							(*picture)(xx*20+k, (yy+1)*20)->blue = 0;
							(*picture)(xx*20+k, (yy+1)*20)->green = 153;
						}
					}
				}
			}
		}
	}

	return picture;
}

PNG* SquareMaze::drawMazeWithSolution()
{
	PNG* picture = drawMaze();
	vector<int> temp = solveMaze();
	vector<int> solution;

	while(!temp.empty())
	{
		solution.push_back(temp.back());
		temp.pop_back();
	}

	int curX = 5, curY = 5;

	while(!solution.empty())
	{
		int dir = solution.back();

		solution.pop_back();
		//cout << dir << endl;
		for(int i = 0; i < 20; i++)
		{
			if(dir == 0)
			{
				curX++;
			}
			else if(dir == 1)
			{
				curY++;
			}
			else if(dir == 2)
			{
				curX--;
			}
			else if(dir == 3)
			{
				curY--;
			}
			//cout << "(" << curX << ", " << curY << ")" << endl;
		}
	}
	curX -= 4;
	curY += 15;

	for(int k = 1; k < 20; k++)
	{
		(*picture)(curX, curY)->red = 204;
		(*picture)(curX, curY)->green = 102;
		(*picture)(curX, curY)->blue = 0;
		curX++;
	}

	return picture;
}

void SquareMaze::clear()
{
	if(maze != NULL)
	{
		for(int i = 0; i < _height; i++)
		{
			if(maze[i] != NULL)
			{
				delete[] maze[i];
				maze[i] = NULL;
			}
		}
		delete[] maze;
		maze = NULL;
	}
}

void SquareMaze::copy(SquareMaze const & other)
{
	_width = other._width;
	_height = other._height;

	maze = new wall*[_height];

	for(int i = 0; i < _height; i++)
	{
		maze[i] = new wall[_width];
	}

	int tileSize = 28;
	for(int y = 0; y < _height; y+=tileSize)
	{
		for(int x = 0; x < _width; x+=tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, _height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, _width); xx++)
				{
					maze[yy][xx].bot = other.maze[yy][xx].bot;
					maze[yy][xx].right = other.maze[yy][xx].right;
				}
			}
		}
	}
}

void SquareMaze::initializeMap(int width, int height, map<pair<int,int>, int> &nodes)
{
	int count = 0;
	int tileSize = 28;
	for(int y = 0; y < _height; y+=tileSize)
	{
		for(int x = 0; x < _width; x+=tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, _height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, _width); xx++)
				{
					nodes.insert(pair<pair<int,int>,int>(pair<int,int>(xx,yy),count));
					count++;
				}
			}
		}
	}
}

void SquareMaze::getPath(vector<int> &vec)
{
	unordered_map<int, vector<int>> map;
	DFS(map);
	vector<int> longestPath;
	int maxKey = 0;
	for(auto key : map)
	{
		//cout << key.second.size() << endl;
		if(key.second.size() > longestPath.size())
		{
			longestPath = key.second;
			maxKey = key.first;
		}
		else if(key.second.size() == longestPath.size())
		{
			if(key.first < maxKey)
			{
				longestPath = key.second;
				maxKey = key.first;
			}
		}
	}

	restoreMaze();
	while(!longestPath.empty())
	{
		/*int temp = longestPath[longestPath.size() - 1 - i];
		longestPath[longestPath.size() - 1 - i] = longestPath[i];
		longestPath[i] = temp;*/
		vec.push_back(longestPath.back());
		longestPath.pop_back();

	}
	//vec = longestPath;
}

void SquareMaze::DFS(unordered_map<int, vector<int>> &map)
{
	stack<pair<int,int>> stack;
	stack.push(pair<int,int>(0,0));
	maze[0][0].traversed = true;

	while(!stack.empty())
	{
		pair<int,int> cur = stack.top();
		stack.pop();
		vector<pair<int,int>> neighbors = getAdjacent(cur.second, cur.first);
		for(pair<int,int> neighbor : neighbors)
		{
			//cout << "( " << cur.first << ", " << cur.second << ")" << endl;
			if(!maze[neighbor.first][neighbor.second].traversed)
			{
				maze[neighbor.first][neighbor.second].traversed = true;
				maze[neighbor.first][neighbor.second].parent = cur;

				if(cur.second + 1 == neighbor.second)
				{
					maze[neighbor.first][neighbor.second].direction = 0;
				}
				else if(cur.second - 1 == neighbor.second)
				{
					maze[neighbor.first][neighbor.second].direction = 2;
				}
				else if(cur.first + 1 == neighbor.first)
				{
					maze[neighbor.first][neighbor.second].direction = 1;
				}
				else if(cur.first - 1 == neighbor.first)
				{
					maze[neighbor.first][neighbor.second].direction = 3;
				}

				stack.push(neighbor);
				if(neighbor.first == _height - 1)
				{
					vector<int> path = pathToParent(map, neighbor.second);
					//cout << path.size() << endl;
					map.insert(pair<int, vector<int>>(neighbor.second, path));
				}
			}
			//if(cur.first == 49 && cur.second == 48) cout << "hi" << endl;
		}
	}
}

vector<int> SquareMaze::pathToParent(unordered_map<int, vector<int>> &map, int x)
{
	wall temp = maze[_height - 1][x];
	vector<int> path;
	while(temp.parent.first != -1 || temp.parent.second != -1)
	{
		//cout << "hi" << endl;
		path.push_back(temp.direction);
		//cout << "(" << temp.parent.first << ", " << temp.parent.second << ")" << endl;
		temp = maze[temp.parent.first][temp.parent.second];
	}
	return path;
}

vector<pair<int,int>> SquareMaze::getAdjacent(int x, int y)
{
	vector<pair<int,int>> vec;
	if(canTravel(x, y, 0))
	{
		vec.push_back(pair<int,int>(y, x + 1));
		//maze[y][x + 1].direction = 0;
	}
	if(canTravel(x, y, 1))
	{
		vec.push_back(pair<int,int>(y + 1, x));
		//maze[y + 1][x].direction = 1;
	}
	if(canTravel(x, y, 2))
	{
		vec.push_back(pair<int,int>(y, x - 1));
		//maze[y][x - 1].direction = 2;	
	}
	if(canTravel(x, y, 3))
	{
		vec.push_back(pair<int,int>(y - 1, x));	
		//maze[y - 1][x].direction = 3;		
	}
	return vec;
}

void SquareMaze::restoreMaze()
{
	int tileSize = 28;
	for(int y = 0; y < _height; y+=tileSize)
	{
		for(int x = 0; x < _width; x+=tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, _height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, _width); xx++)
				{
					maze[yy][xx].traversed = false;
				}
			}
		}
	}
}

void SquareMaze::colorMaze(PNG *& picture) const
{
	int tileSize = 28;
	int height = picture->height();
	int width = picture->width();


	for(int y = 0; y < height; y+= tileSize)
	{
		for(int x = 0; x < width; x+= tileSize)
		{
			for(int yy = y; yy < min(y + tileSize, height); yy++)
			{
				for(int xx = x; xx < min(x + tileSize, width); xx++)
				{
					(*picture)(xx,yy)->red = 204;
					(*picture)(xx,yy)->green = 102;
					(*picture)(xx,yy)->blue = 0;
				}
			}
		}
	}

}