var EPSILON = 0.000001;
//var edge1 = [0,0,0];
//var edge2 = [0,0,0];
//var tvec = [0,0,0];
//var pvec = [0,0,0];
//var qvec = [0,0,0];


class Vec3d {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  
  static subtract(a, b) {
    let out = new Vec3d(0, 0, 0)
    
    out.x = a.x - b.x
    out.y = a.y - b.y
    out.z = a.z - b.z
    
    return out
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z
  }

  static cross(a, b) {
    let out = new Vec3d(0, 0, 0)
    let ax = a.x, ay = a.y, az = a.z,
        bx = b.x, by = b.y, bz = b.z

    out.x = ay * bz - az * by
    out.y = az * bx - ax * bz
    out.z = ax * by - ay * bx
    
    return out
  }
  
  distanceTo(p) {
    let x_2 = (this.x - p.x) * (this.x - p.x);
    let y_2 = (this.y - p.y) * (this.y - p.y);
    let z_2 = (this.z - p.z) * (this.z - p.z);
    
    return Math.sqrt( x_2 + y_2 + z_2 );
  }
}

class Ray {
  constructor(point, direction) {
    this.point = point
    this.direction = direction
  }
}

class Triangle {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }

  rayIntersect(ray) {
    let out = new Vec3d(0, 0, 0);

    let edge1 = Vec3d.subtract(this.p2, this.p1);
    let edge2 = Vec3d.subtract(this.p3, this.p1);
    
    let pvec = Vec3d.cross(ray.direction, edge2);
    let det = Vec3d.dot(edge1, pvec);
    
    console.dir(edge1);
    console.dir(edge2);
    console.dir(det);
    
    if (det < EPSILON) return null;
    let tvec = Vec3d.subtract(ray.point, this.p1);
    let u = Vec3d.dot(tvec, pvec);
    if (u < 0 || u > det) return null;
    let qvec = Vec3d.cross(tvec, edge1);
    let v = Vec3d.dot(ray.direction, qvec);
    if (v < 0 || u + v > det) return null;
    
    var t = Vec3d.dot(edge2, qvec) / det;
    out.x = ray.point.x + t * ray.direction.x;
    out.y = ray.point.y + t * ray.direction.y;
    out.z = ray.point.z + t * ray.direction.z;
    return out;
  }
}

class Mesh {
  constructor(triangles = []) {
    this.triangles = triangles;
  }

  addTriangle( triangle ) {
    this.triangles.push( triangle )
  }
  
  getCollision( ray ) {
    // Return the first collision only
    for( let x=0; x < this.triangles.length; x++){
      let colPoint = this.triangles[x].rayIntersect(ray)
      console.dir( colPoint );
      if(!isNaN(colPoint)) return colPoint;
    }
    return;
  }
}

class Transducer {
  constructor(point, direction) {
    this.point = point
    this.direction = direction
  }
  
  castRays() {
    // return an array of rays that cover the entire beam width in 3d.
    // Give each an intensity based on the beam profile
    return [ new Ray(this.point, this.direction) ]
  }
}



let transducers = [];
let mesh = new Mesh();

// Load a proper mesh. Maybe STL or something?
mesh.addTriangle( new Triangle(new Vec3d(10,-10,0), new Vec3d(10,10,0), new Vec3d(10,0,-10)) )

// Load transducers in a pattern
transducers.push( new Transducer(new Vec3d(0,0,0), new Vec3d(1,0,0)) );

transducers.forEach(transducer => {
  let rays = transducer.castRays();
  
  rays.forEach(ray => {
    let collisionPoint = mesh.getCollision( ray )
    console.dir( collisionPoint )
  });
});

































