const FPS = 60;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 1200;
const LOG_OFFSET = 0;
const SOFTENING_FACTOR = 0.001
const PIXEL_SCALE = 1800;
const PIXEL_OFFSET_X = SCREEN_WIDTH / 2;
const PIXEL_OFFSET_Y = SCREEN_HEIGHT / 2;

// year length of each body, earth days
const YEAR_LENGTH_BODY0 = 365;
const YEAR_LENGTH_BODY1 = 365;
const YEAR_LENGTH_BODY2 = 365;
const YEAR_LENGTH_EARTH = 365;

// distance of each body from the 0, AU
const DISTANCE_BODY0 = 0;
const DISTANCE_BODY1 = 1;
const DISTANCE_BODY2 = 1.00257;

// initial velocity of each body
const VELOCITY_INITIAL_BODY0 = 2 * Math.PI * DISTANCE_BODY0 * YEAR_LENGTH_EARTH / YEAR_LENGTH_BODY0;
const VELOCITY_INITIAL_BODY1 = 2 * Math.PI * DISTANCE_BODY1 * YEAR_LENGTH_EARTH / YEAR_LENGTH_BODY1;
const VELOCITY_INITIAL_BODY2 = 2 * Math.PI * DISTANCE_BODY2 * YEAR_LENGTH_EARTH / YEAR_LENGTH_BODY2;

// mass of each body, solar masses
const MASS_BODY0 = 1;
const MASS_BODY1 = 3.003e-6;
const MASS_BODY2 = 3.69432e-8;

// radius of each body, display parameter
const RADIUS_BODY0 = 30;
const RADIUS_BODY1 = 10;
const RADIUS_BODY2 = 5;

// color of each body, display parameter
const COLOR_BACKGROUND = '#000000';
const COLOR_BODY0 = "#FDB813";
const COLOR_BODY1 = "#0F5720";
const COLOR_BODY2 = "#FF7E47";

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
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + SOFTENING_FACTOR);
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

    push(body)
    {
        this.bodies.push(body);
    }

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

    draw()
    {
        for(let index_bodies = 0; index_bodies < this.bodies.length; index_bodies++)
        {
            this.bodies[index_bodies].draw();
        }
    }

    drawLog()
    {
        for(let index_bodies = 0; index_bodies < this.bodies.length; index_bodies++)
        {
            this.bodies[index_bodies].drawLog();
        }
    }

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

const body0 = new Body
(
    new Vector(DISTANCE_BODY0, 0), // postition
    new Vector(0, VELOCITY_INITIAL_BODY0), // velocity
    new Vector(0, 0), // acceleration
    MASS_BODY0, // mass
    RADIUS_BODY0, // radius
    COLOR_BODY0 // color
);

const body1 = new Body
(
    new Vector(DISTANCE_BODY1, 0), // postition
    new Vector(0, VELOCITY_INITIAL_BODY1), // velocity
    new Vector(0, 0), // acceleration
    MASS_BODY1, // mass
    RADIUS_BODY1, // radius
    COLOR_BODY1 // color
);

const body2 = new Body
(
    new Vector(DISTANCE_BODY2, 0), // postition
    new Vector(0, VELOCITY_INITIAL_BODY2), // velocity
    new Vector(0, 0), // acceleration
    MASS_BODY2, // mass
    RADIUS_BODY2, // radius
    COLOR_BODY2 // color
);

system.push(body0);
system.push(body1);
system.push(body2)

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
    system.drawLog();
}
