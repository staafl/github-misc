// 2013-06-22 12:57:47

using Adjacency = System.Tuple<int, int>;
using AdjacencyList = System.Collections.Generic.List<System.Tuple<int, int>>;
using Graph = System.Collections.Generic.Dictionary<int, System.Collections.Generic.List<System.Tuple<int, int>>>;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System;


// .\Heap.cs


class Heap<T> : IEnumerable<T>
{
    T[] array = new T[15];

    readonly Comparison<T> comparison;

    public Heap()
        : this(Comparer<T>.Default.Compare)
    {
    }

    public Heap(Comparison<T> comparison)
    {
        comparison.ThrowIfNull();
        this.comparison = comparison;
    }

    public void Add(T elem)
    {
        MaybeExpand(1);

        this.array[this.Count] = elem;
        this.Count += 1;

        this.BubbleUp(this.Count - 1);
    }

    public bool Delete(T elem)
    {
        for (int ii = 0; ii < this.Count; ++ii)
        {
            if (array[ii].SafeEquals(elem))
            {
                if (ii == this.Count - 1)
                {
                    this.Count -= 1;
                    return true;
                }

                this.array[ii] = this.array[this.Count - 1];

                this.Count -= 1;

                BubbleDown(ii);

                return true;
            }
        }

        return false;
    }

    public int Count
    {
        get;
        private set;
    }

    public int Capacity
    {
        get { return array.Length; }
    }

    public T ChopHead()
    {

        if (this.Count == 0)
            throw new InvalidOperationException("Heap is empty.");

        var ret = this.array[0];

        this.array[0] = this.array[this.Count - 1];

        this.BubbleDown(0);

        this.Count -= 1;

        return ret;
    }

    public bool IsEmpty
    {
        get { return this.Count == 0; }
    }


    bool Dominates(int who, int whom)
    {
        if (whom >= this.Count)
            return true;
        return this.comparison(this.array[who],
                               this.array[whom]) >= 0;
    }

    bool DominatedByParent(int index)
    {
        if (index <= 0)
            return true;

        return Dominates(Parent(index), index);
    }

    int SwapWithParent(int index)
    {
        Swap(index, index / 2);
        return index / 2;
    }

    bool DominatesChildren(int index)
    {
        if (LeftChild(index) >= this.Count)
            return true;

        if (DominatedByParent(LeftChild(index)))
            return false;

        if (RightChild(index) >= this.Count)
            return true;

        if (DominatedByParent(RightChild(index)))
            return false;

        return true;
    }

    int LeftChild(int index)
    {
        return index * 2 + 1;
    }

    int RightChild(int index)
    {
        return index * 2 + 2;
    }

    int Parent(int index)
    {
        if (index % 2 == 0)
            return index / 2 - 1;
        else
            return index / 2;

    }

    void Swap(int index1, int index2)
    {
        var temp = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = temp;
    }

    int SwapWithDominantChild(int index)
    {
        if (Dominates(LeftChild(index), RightChild(index)))
        {
            Swap(index, LeftChild(index));
            return LeftChild(index);
        }
        else
        {
            Swap(index, RightChild(index));
            return RightChild(index);
        }
    }

    void BubbleUp(int index)
    {
        if (DominatedByParent(index))
            return;

        var parentIndex = SwapWithParent(index);

        BubbleUp(parentIndex);
    }

    void BubbleDown(int index)
    {
        if (DominatesChildren(index))
            return;

        var largerChildIndex = SwapWithDominantChild(index);

        BubbleDown(largerChildIndex);
    }


    bool MaybeExpand(int d)
    {
        if (this.Count + d < this.Capacity)
            return false;

        // jump over a power of 2
        // 1 + 2 + 4 ... + 2^n => 
        // 1 + 2 + 4 ... + 2^n + 2^(n+1) + 2^(n+2)

        Array.Resize(ref array, (this.Capacity + 1) * 4 - 1);

        return true;
    }

    public IEnumerator<T> GetEnumerator()
    {
        return (array as IEnumerable<T>).Take(this.Count).GetEnumerator();
    }

    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
        return this.GetEnumerator();
    }



}
// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!
// .\libcs.cs


static class Helpers
{
    public static bool SafeEquals<T>(this T what, T whom)
    {
        if (what == null)
            return whom == null;
        return what.Equals(whom);
    }
    public static bool SameContents<T>(this IEnumerable<T> seq1, IEnumerable<T> seq2)
    {
        return seq1.OrderBy(t=>t,Comparer<T>.Default).SequenceEqual(
               seq2.OrderBy(t=>t,Comparer<T>.Default));
    }
    
    public static bool SameContents<T>(this IEnumerable<T> seq1, IEnumerable<T> seq2, Func<T, int> f)
    {
        return seq1.OrderBy(f).SequenceEqual(
               seq2.OrderBy(f));
    }
    
    public static void ThrowIfNegative(this int num, string msg = null)
    {
        if (num < 0)
        {
            throw GetException<ArgumentOutOfRangeException>(msg ?? "Argument must be nonnegative, got: " + num);
        }
    }

    public static void ThrowIfNull<T>(this T obj, string msg = null)
    {
        if (obj == null)
        {
            throw GetException<ArgumentNullException>(msg ?? "Argument cannot be null.");
        }
    }

    public static void ThrowIfNull<T, TE>(this T obj, string msg = null) where TE : Exception
    {
        if (obj == null)
        {
            throw GetException<TE>(msg ?? "Value cannot be null.");
        }
    }

    public static void ThrowIfNotDefined<TEnum>(this TEnum enumValue, string msg = null)
    {
        if (!Enum.IsDefined(typeof(TEnum), enumValue))
        {
            throw GetException<ArgumentException>(msg ?? "Invalid enum value: " + enumValue);
        }
    }

    public static void ThrowIfNotDefined<TEnum, TE>(this TEnum enumValue, string msg = null)
        where TE : Exception
    {
        if (!Enum.IsDefined(typeof(TEnum), enumValue))
        {
            throw GetException<TE>(msg ?? "Invalid enum value: " + enumValue);
        }
    }

    public static TE GetException<TE>(string msg, Exception innerException = null) where TE : Exception
    {

        var ex = Activator.CreateInstance(typeof(TE), new object[] { msg, innerException });

        return (TE)ex;

    }
    
    public static V GetOrDefault<K,V>(this IDictionary<K,V> dict, K key, V defValue) {
        V ret;
        if (dict.TryGetValue(key, out ret))
            return ret;
        return defValue;
    }
}

















// 2013-06-13
// 2013-06-13
// 2013-06-13
// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!
// .\PriorityQueue.cs


class PriorityQueue<P, V> : IEnumerable<V>
{
    readonly Heap<Tuple<P, V>> heap;
    readonly Dictionary<V,P> priorities;

    public PriorityQueue(Comparison<P> comparison)
    {
        comparison.ThrowIfNull();

        heap = new Heap<Tuple<P, V>>((t1, t2) => comparison(t1.Item1, t2.Item1));
        priorities = new Dictionary<V,P>();
    }

    public PriorityQueue()
        : this(Comparer<P>.Default.Compare)
    {
    }

    public void Enqueue(P priority, V item)
    {
        this.priorities.Add(item, priority);
        this.heap.Add(Tuple.Create(priority, item));
    }

    public void Rekey(V item, P newPriority)
    {
        if (this.priorities.ContainsKey(item))
        {
            var tuple = new Tuple<P, V>(this.priorities[item], item);
            this.heap.Delete(tuple);
            this.priorities.Remove(item);
        }
        this.Enqueue(newPriority, item);
    }
    public P Priority(V item)
    {
        return this.priorities[item];
    }
    public P PriorityOrDefault(V item, P def)
    {
        return this.priorities.GetOrDefault(item, def);
    }
    public V Dequeue()
    {
        if (this.Count == 0)
            throw new InvalidOperationException("PriorityQueue is empty.");

        var ret = this.heap.ChopHead().Item2;
        priorities.Remove(ret);
        return ret;
    }

    public Tuple<P, V> DequeueWithPriority()
    {
        if (this.Count == 0)
            throw new InvalidOperationException("PriorityQueue is empty.");

        var ret = this.heap.ChopHead();
                priorities.Remove(ret.Item2);
        return ret;
    }

    public int Count
    {
        get { return this.heap.Count; }
    }

    public int Capacity
    {
        get { return this.heap.Capacity; }
    }

    public bool IsEmpty
    {
        get { return this.Count == 0; }
    }

    public IEnumerable<Tuple<P, V>> NotInOrder()
    {
        return heap;
    }

    // slow
    public IEnumerator<V> GetEnumerator()
    {
        return heap.OrderBy(t => t.Item1).Select(t => t.Item2).GetEnumerator();
    }

    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
        return this.GetEnumerator();
    }





}
// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!
// .\program.cs


// no need to define whole classes

class Program
{
    static void Main(string[] args)
    {
//         Console.SetIn(new StringReader(
// @"3 2 1 
// 1
// 1 2 1
// 3 2 2"));

        var split = GetInts();

        int verticeCount = split[0];
        int edgeCount = split[1];
        int hospitalCount = split[2];

        var hospitals = GetInts();

        var graph = new Graph();

        for (int ii = 0; ii < verticeCount; ++ii)
        {
            graph[ii + 1] = new AdjacencyList();
        }

        for (int ii = 0; ii < edgeCount; ++ii)
        {
            split = GetInts();

            graph[split[0]].Add(Tuple.Create(split[1], split[2]));
            graph[split[1]].Add(Tuple.Create(split[0], split[2]));
        }

        int? minTree = null;
        int? minHospital = null;

        // we're looking for the hospital which generates
        // the minimum path sum for each house
        // we modify Dijkstra's algorithm and run it once for each hospital
        
        foreach (var hospital in hospitals)
        {
            var treeWeight = GetTreeWeight(graph, hospital, verticeCount, hospitals);

            if (treeWeight < minTree || minTree == null)
            {
                minTree = treeWeight;
                minHospital = hospital;
            }
        }

        Console.WriteLine(minTree);
    }

    // a standard implementation of Dijkstra's algorithm using a priority queue
    // with a minor modification for the problem
    
    static int GetTreeWeight(Graph graph, int hospital, int verticeCount, IEnumerable<int> hospitals)
    {
        var distances = new PriorityQueue<int, int>((e1,e2) => -e1.CompareTo(e2));

        foreach (var adj in graph[hospital])
        {
            distances.Enqueue(adj.Item2, adj.Item1);
        }

        // return value
        int ret = 0;
        
        var tree = new HashSet<int>();
        int housesAdded = 0;
        int totalHouses = verticeCount - hospitals.Count();
        
        while (housesAdded < totalHouses)
        {
            // edge nearest to 'hospital'
            
            var min = distances.DequeueWithPriority();
            var weight = min.Item1;
            
            // the new vertex in the tree
            
            var v1 = min.Item2;

            // modification of algorithm:
            // sum the distance to the root of all nodes that aren't
            // hospitals
            
            if (!hospitals.Contains(v1)) 
            {
                housesAdded += 1;
                ret += weight;
            }
            
            tree.Add(v1);

            // update the priorities of all external neighbours of the vertex
            // we've just added
            
            foreach (var adj in graph[v1])
            {
                var v2 = adj.Item1;
                if (v2 == hospital)
                    continue;
                if (tree.Contains(v2))
                    continue;

                var priority = distances.PriorityOrDefault(v2, int.MaxValue);

                if (priority > weight + adj.Item2)
                    distances.Rekey(v2, weight + adj.Item2);
            }
        }

        return ret;
    }

    static int[] GetInts()
    {
        return Console.ReadLine()
                      .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                      .Select(int.Parse)
                      .ToArray();
    }
}


















// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!