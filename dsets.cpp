/* Your code here! */
#include "dsets.h"

void DisjointSets::addelements(int num)
{
	for(int i = 0; i < num; i++)
	{
		nodes.push_back(-1);
	}
}

int DisjointSets::find(int elem)
{
	if(nodes.size() <= 0 || (size_t)elem >= nodes.size()) return 0;
	else if(nodes[elem] < 0) return elem;
	else
	{
		nodes[elem] = find(nodes[elem]);
		return nodes[elem];
	}
}

void DisjointSets::setunion(int a, int b)
{
	if(a == b || nodes.size() == 0 || (size_t)a >= nodes.size() || (size_t)b >= nodes.size()) return;
	int rootA = find(a);
	int rootB = find(b);

	if(nodes[rootA] <= nodes[rootB])
	{
		int temp = nodes[rootB];
		nodes[rootB] = rootA;
		nodes[rootA] += temp;
	}
	else
	{
		int temp = nodes[rootA];
		nodes[rootA] = rootB;
		nodes[rootB] += temp;
	}
}