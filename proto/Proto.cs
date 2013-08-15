using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        dynamic father = new Proto();

        father.FirstName = "Adam";
        father.LastName = "Smith";
        father.Address = "Seattle, WA";
        father.Introduce = (Action<dynamic>)(o => Console.WriteLine("{0} {1} from {2}", o.FirstName, o.LastName, o.Address));

        father.Introduce();

        dynamic daughter = father.Spawn();
        daughter.FirstName = "Caroline";
        daughter.Introduce();

        // let's marry Caroline off...
        daughter.LastName = "Stiller";
        daughter.Address = "Minneapolis, MI";
        daughter.Introduce();

        // time for some grand-children
        dynamic grandson = daughter.Spawn();
        grandson.FirstName = "Tim";
        dynamic granddaughter = daughter.Spawn();
        granddaughter.FirstName = "Synthia";

        // whoops, house burned down.
        // family goes back to live with the grandparents
        daughter.DeleteMember("Address");
        granddaughter.Introduce();


    }
}
public class Proto : DynamicObject
{
    readonly Dictionary<string, dynamic> members = new Dictionary<string, dynamic>();
    public dynamic Prototype { get; private set; }

    public Proto Spawn()
    {
        return new Proto(this);
    }

    public Proto()
    {
    }

    protected Proto(Proto prototype)
    {
        this.Prototype = prototype;
    }

    public dynamic this[string memberName]
    {
        get
        {
            object ret;
            if (!this.TryGetMember(memberName, out ret))
                throw new MissingMemberException(memberName);
            return ret;
        }
        set
        {
            this.members[memberName] = value;
        }
    }

    public bool DeleteMember(string memberName)
    {
        return this.members.Remove(memberName);
    }
    public bool DeleteMember(object memberValue)
    {
        var kvp = this.members.Where(_kvp => object.ReferenceEquals(_kvp.Value, memberValue)).FirstOrDefault();
        if (kvp.Equals(default(KeyValuePair<string, dynamic>)))
            return false;
        return this.members.Remove(kvp.Key);
    }
    public bool HasOwnMember() { throw new NotImplementedException(); }
    public bool HasMember() { throw new NotImplementedException(); }
    public IEnumerable<object> OwnMembers() { throw new NotImplementedException(); }
    public IEnumerable<object> Members() { throw new NotImplementedException(); }


    public override bool TrySetMember(SetMemberBinder binder, object value)
    {
        this[binder.Name] = value;
        return true;
    }
    public override bool TryGetMember(GetMemberBinder binder, out object result)
    {
        return this.TryGetMember(binder.Name, out result);
    
    }

    public bool TryGetMember(string name, out object result)
    {
        if (this.members.TryGetValue(name, out result))
            return true;

        if (this.Prototype == null)
            return false;

        var ret = this.Prototype.TryGetMember(name, out result);
        return ret;
    }

    public override bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result)
    {
        return this.TryInvokeMember(this, binder, args, out result);
    }

    protected bool TryInvokeMember(Proto instance, InvokeMemberBinder binder, object[] args, out object result)
    {
        result = null;

        object method;

        if (this.members.TryGetValue(binder.Name, out method))
        {
            args = new object[] { instance }.Concat(args).ToArray();
            result = ((dynamic)method).DynamicInvoke(args);
            return true;
        }

        if (this.Prototype == null)
            return false;

        var ret = this.Prototype.TryInvokeMember(instance, binder, args, out result);
        return ret;
    }
}




