const FPS = 60;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 1200;
const PIXEL_SCALE = 350;
const PIXEL_OFFSET_X = SCREEN_WIDTH / 2;
const PIXEL_OFFSET_Y = SCREEN_HEIGHT / 2;

// year length of each body, earth days
const YEAR_LENGTH_SUN = 0;
const YEAR_LENGTH_MERCURY = 88;
const YEAR_LENGTH_VENUS = 225;
const YEAR_LENGTH_EARTH = 365;
const YEAR_LENGTH_MARS = 687;
const YEAR_LENGTH_JUPITER = 4333;
const YEAR_LENGTH_SATURN = 10759;
const YEAR_LENGTH_URANUS = 30687;
const YEAR_LENGTH_NEPTUNE = 60190;

// distance of each body from the sun, AU
const DISTANCE_SUN = 0;
const DISTANCE_MERCURY = 0.4;
const DISTANCE_VENUS = 0.72;
const DISTANCE_EARTH = 1;
const DISTANCE_MARS = 1.5;
const DISTANCE_JUPITER = 5.2;
const DISTANCE_SATURN = 9;
const DISTANCE_URANUS = 19;
const DISTANCE_NEPTUNE = 30.1;

// initial velocity of each body
const VELOCITY_INITIAL_SUN = 0;
const VELOCITY_INITIAL_MERCURY = 2 * Math.PI * DISTANCE_MERCURY * YEAR_LENGTH_EARTH / YEAR_LENGTH_MERCURY;
const VELOCITY_INITIAL_VENUS = 2 * Math.PI * DISTANCE_VENUS * YEAR_LENGTH_EARTH / YEAR_LENGTH_VENUS;
const VELOCITY_INITIAL_EARTH = 2 * Math.PI * DISTANCE_EARTH * YEAR_LENGTH_EARTH / YEAR_LENGTH_EARTH;
const VELOCITY_INITIAL_MARS = 2 * Math.PI * DISTANCE_MARS * YEAR_LENGTH_EARTH / YEAR_LENGTH_MARS;
const VELOCITY_INITIAL_JUPITER = 2 * Math.PI * DISTANCE_JUPITER * YEAR_LENGTH_EARTH / YEAR_LENGTH_JUPITER;
const VELOCITY_INITIAL_SATURN = 2 * Math.PI * DISTANCE_SATURN * YEAR_LENGTH_EARTH / YEAR_LENGTH_SATURN;
const VELOCITY_INITIAL_URANUS = 2 * Math.PI * DISTANCE_URANUS * YEAR_LENGTH_EARTH / YEAR_LENGTH_URANUS;
const VELOCITY_INITIAL_NEPTUNE = 2 * Math.PI * DISTANCE_NEPTUNE * YEAR_LENGTH_EARTH / YEAR_LENGTH_NEPTUNE;

// mass of each body, solar masses
const MASS_SUN = 1;
const MASS_MERCURY = 1.656e-7;
const MASS_VENUS = 2.447e-6;
const MASS_EARTH = 3.003e-6;
const MASS_MARS = 3.213e-7;
const MASS_JUPITER = 9.546e-4;
const MASS_SATURN = 2.857e-4;
const MASS_URANUS = 4.365e-5;
const MASS_NEPTUNE = 5.149e-5;

// radius of each body, display parameter
const RADIUS_SUN = 30;
const RADIUS_MERCURY = 17;
const RADIUS_VENUS = 19;
const RADIUS_EARTH = 20;
const RADIUS_MARS = 18;
const RADIUS_JUPITER = 25;
const RADIUS_SATURN = 24;
const RADIUS_URANUS = 23;
const RADIUS_NEPTUNE = 22;

// color of each body, display parameter
const COLOR_BACKGROUND = '#000000';
const COLOR_SUN = "#FDB813";
const COLOR_MERCURY = "#B7B8B9";
const COLOR_VENUS = "#928590";
const COLOR_EARTH = "#0F5720";
const COLOR_MARS = "#FF7E47";
const COLOR_JUPITER = "#EBF3F6";
const COLOR_SATURN = "#E2BF7D";
const COLOR_URANUS = "#ACE5EE";
const COLOR_NEPTUNE = "#2E5D9D";

// simulation timestep, earth years
const TIME_STEP = 0.001;

// gravitational constant
const G = 4 * Math.PI * Math.PI;

class Vector
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    add(vector2)
    {
        this.x += vector2.x;
        this.y += vector2.y;
    }

    sum(vector2)
    {
        return new Vector(this.x + vector2.x, this.y + vector2.y);
    }

    subtract(vector2)
    {
        this.x -= vector2.x;
        this.y -= vector2.y;
    }

    difference(vector2)
    {
        return new Vector(vector2.x - this.x, vector2.y - this.y);
    }

    multiply(scalar)
    {
        this.x *= scalar;
        this.y *= scalar;
    }

    product(scalar)
    {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar)
    {
        this.x /= scalar;
        this.y /= scalar;
    }

    quotient(scalar)
    {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    magnitude()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    direction()
    {
        return Math.atan2(this.y, this.x);
    }
}

class Body
{
    constructor(position, velocity, acceleration, mass, radius, color)
    {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }

    // update this body's acceleration based on gravitational attraction to other body
    updateAcceleration(body2)
    {
        let distance = this.position.difference(body2.position);
        let distance_magnitude = distance.magnitude();
        let distance_direction = distance.quotient(distance_magnitude);
        let acceleration_magnitude = G * body2.mass / (distance_magnitude * distance_magnitude);
        let acceleration_body2 = distance_direction.product(acceleration_magnitude);

        this.acceleration.add(acceleration_body2);
    }

    // update this body's position based on its acceleration
    updatePosition()
    {
        let acceleration_dt = this.acceleration.product(TIME_STEP);
        this.velocity.add(acceleration_dt);

        let velocity_dt = this.velocity.product(TIME_STEP);
        this.position.add(velocity_dt);
    }

    // draw body on a standard coordinate system
    draw()
    {
        let x_pixel = (this.position.x * PIXEL_SCALE) + PIXEL_OFFSET_X;
        let y_pixel = (this.position.y * PIXEL_SCALE) + PIXEL_OFFSET_Y;
        fill(this.color);
        ellipse(x_pixel, y_pixel, this.radius, this.radius);
    }

    // draw body on a logarithmic coordinate system
    drawLog()
    {
        let position_scaled = Math.log10(this.position.magnitude() + 1) * PIXEL_SCALE;
        let postion_pixel = this.position.product(position_scaled / this.position.magnitude());
        postion_pixel.x += PIXEL_OFFSET_X;
        postion_pixel.y += PIXEL_OFFSET_Y;

        fill(this.color);
        ellipse(postion_pixel.x, postion_pixel.y, this.radius, this.radius);
    }

    // draw body on a logarithmic coordinate system, relative to the position of another body
    drawLogRelative(body2)
    {
        let position_relative = body2.position.difference(this.position);
        let position_scaled = Math.log10(position_relative.magnitude() + 1) * PIXEL_SCALE;
        let postion_pixel = position_relative.product(position_scaled / position_relative.magnitude());
        postion_pixel.x += (body2.position.x * PIXEL_SCALE) + PIXEL_OFFSET_X;
        postion_pixel.y += (body2.position.y * PIXEL_SCALE) + PIXEL_OFFSET_Y;

        fill(this.color);
        ellipse(postion_pixel.x, postion_pixel.y, this.radius, this.radius);
    }

    // debugging
    print()
    {
        console.log("position: (" + this.position.x + ", " + this.position.y + ")")
        console.log("velocity: (" + this.velocity.x + ", " + this.velocity.y + ")")
        console.log("acceleration: (" + this.acceleration.x + ", " + this.acceleration.y + ")")
        console.log("mass: " + this.mass)
        console.log("radius: " + this.radius)
        console.log("color: " + this.color)
    }
}

class System
{
    constructor()
    {
        this.bodies = [];
    }

    // add a new body to the system
    push(body)
    {
        this.bodies.push(body);
    }

    // update the position and acceleration of each body in the system
    update()
    {
        for(let index_bodies_i = 0; index_bodies_i < this.bodies.length; index_bodies_i++)
        {
            this.bodies[index_bodies_i].acceleration = new Vector(0, 0);

            for(let index_bodies_j = 0; index_bodies_j < this.bodies.length; index_bodies_j++)
            {
                if(index_bodies_i != index_bodies_j)
                {
                    this.bodies[index_bodies_i].updateAcceleration(this.bodies[index_bodies_j]);
                }
            }
        }

        for(let index_bodies_i = 0; index_bodies_i < this.bodies.length; index_bodies_i++)
        {
            this.bodies[index_bodies_i].updatePosition();
        }
    }

    // draw each body in the system on standard coordinate system
    draw()
    {
        for(let index_bodies = 0; index_bodies < this.bodies.length; index_bodies++)
        {
            this.bodies[index_bodies].draw();
        }
    }

    // draw each body in the system on a logarithmic coordinate system
    drawLog()
    {
        for(let index_bodies = 0; index_bodies < this.bodies.length; index_bodies++)
        {
            this.bodies[index_bodies].drawLog();
        }
    }

    // draw each body in the system on a logarithmic coordinate system, relative to the position of the sun
    drawLogRelative()
    {
        // draw the sun on standard coordinates
        this.bodies[0].draw();

        for(let index_bodies = 1; index_bodies < this.bodies.length; index_bodies++)
        {
            // draw the rest of the planets relative to the sun
            this.bodies[index_bodies].drawLogRelative(this.bodies[0]);
        }
    }

    print()
    {
        for(let index_bodies = 0; index_bodies < this.bodies.length; index_bodies++)
        {
            this.bodies[index_bodies].print();
        }
    }
}

const system = new System();

const sun = new Body
(
    new Vector(DISTANCE_SUN, 0), // postition
    new Vector(0, VELOCITY_INITIAL_SUN), // velocity
    new Vector(0, 0), // acceleration
    MASS_SUN, // mass
    RADIUS_SUN, // radius
    COLOR_SUN // color
);

const mercury = new Body
(
    new Vector(DISTANCE_MERCURY, 0), // postition
    new Vector(0, VELOCITY_INITIAL_MERCURY), // velocity
    new Vector(0, 0), // acceleration
    MASS_MERCURY, // mass
    RADIUS_MERCURY, // radius
    COLOR_MERCURY // color
);

const venus = new Body
(
    new Vector(DISTANCE_VENUS, 0), // postition
    new Vector(0, VELOCITY_INITIAL_VENUS), // velocity
    new Vector(0, 0), // acceleration
    MASS_VENUS, // mass
    RADIUS_VENUS, // radius
    COLOR_VENUS // color
);

const earth = new Body
(
    new Vector(DISTANCE_EARTH, 0), // postition
    new Vector(0, VELOCITY_INITIAL_EARTH), // velocity
    new Vector(0, 0), // acceleration
    MASS_EARTH, // mass
    RADIUS_EARTH, // radius
    COLOR_EARTH // color
);

const mars = new Body
(
    new Vector(DISTANCE_MARS, 0), // postition
    new Vector(0, VELOCITY_INITIAL_MARS), // velocity
    new Vector(0, 0), // acceleration
    MASS_MARS, // mass
    RADIUS_MARS, // radius
    COLOR_MARS // color
);

const jupiter = new Body
(
    new Vector(DISTANCE_JUPITER, 0), // postition
    new Vector(0, VELOCITY_INITIAL_JUPITER), // velocity
    new Vector(0, 0), // acceleration
    MASS_JUPITER, // mass
    RADIUS_JUPITER, // radius
    COLOR_JUPITER // color
);

const saturn = new Body
(
    new Vector(DISTANCE_SATURN, 0), // postition
    new Vector(0, VELOCITY_INITIAL_SATURN), // velocity
    new Vector(0, 0), // acceleration
    MASS_SATURN, // mass
    RADIUS_SATURN, // radius
    COLOR_SATURN // color
);

const uranus = new Body
(
    new Vector(DISTANCE_URANUS, 0), // postition
    new Vector(0, VELOCITY_INITIAL_URANUS), // velocity
    new Vector(0, 0), // acceleration
    MASS_URANUS, // mass
    RADIUS_URANUS, // radius
    COLOR_URANUS // color
);

const neptune = new Body
(
    new Vector(DISTANCE_NEPTUNE, 0), // postition
    new Vector(0, VELOCITY_INITIAL_NEPTUNE), // velocity
    new Vector(0, 0), // acceleration
    MASS_NEPTUNE, // mass
    RADIUS_NEPTUNE, // radius
    COLOR_NEPTUNE // color
);

system.push(sun);
system.push(mercury);
system.push(venus)
system.push(earth);
system.push(mars);
system.push(jupiter);
system.push(saturn);
system.push(uranus);
system.push(neptune);

function setup()
{
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    noStroke();
}

function draw()
{
    frameRate(FPS);
    background(COLOR_BACKGROUND);
    fill("#FFFFFF");
    text(frameRate(), 10, 10);
    
    system.update();
    system.drawLogRelative();
}
