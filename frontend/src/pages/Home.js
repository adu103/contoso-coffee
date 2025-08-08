import React from 'react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Welcome to Contoso Coffee</h2>
          <p>
            Where passion for coffee meets exceptional quality. 
            Discover our carefully curated selection of premium coffee beans, 
            expertly roasted to perfection and delivered fresh to your cup.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <h3>Our Story</h3>
          <div className="about-grid">
            <div className="about-card">
              <h4>🏪 Our Location</h4>
              <p>
                Located in the heart of Bean City at 123 Coffee Street, 
                Contoso Coffee has been serving the community since 2015. 
                Our cozy cafe provides the perfect atmosphere for coffee lovers, 
                students, and professionals alike.
              </p>
              <p>
                <strong>Address:</strong> 123 Coffee Street, Bean City, BC 12345<br/>
                <strong>Phone:</strong> (555) 123-BREW<br/>
                <strong>Hours:</strong> Mon-Fri 6AM-8PM, Sat-Sun 7AM-9PM
              </p>
            </div>
            
            <div className="about-card">
              <h4>📖 Our History</h4>
              <p>
                Founded by coffee enthusiast Maria Contoso, our journey began 
                with a simple mission: to bring the world's finest coffee 
                experiences to our local community. What started as a small 
                family business has grown into a beloved local institution.
              </p>
              <p>
                We source our beans directly from farmers around the world, 
                ensuring fair trade practices and supporting sustainable 
                coffee growing communities.
              </p>
            </div>
            
            <div className="about-card">
              <h4>☕ Our Philosophy</h4>
              <p>
                At Contoso Coffee, we believe that great coffee is more than 
                just a beverage—it's a moment of connection, creativity, and 
                comfort. Every cup we serve is crafted with care, using only 
                the finest ingredients and time-honored brewing techniques.
              </p>
              <p>
                Whether you're looking for your daily caffeine fix or exploring 
                new flavors, we're here to guide you on your coffee journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{backgroundColor: 'white'}}>
        <div className="container">
          <h3>Why Choose Contoso Coffee?</h3>
          <div className="about-grid">
            <div className="about-card">
              <h4>🌱 Sustainable Sourcing</h4>
              <p>
                We partner directly with coffee farmers to ensure fair wages 
                and sustainable farming practices that protect the environment.
              </p>
            </div>
            
            <div className="about-card">
              <h4>🔥 Expert Roasting</h4>
              <p>
                Our master roasters bring out the unique characteristics of 
                each bean, creating distinctive flavor profiles you won't find anywhere else.
              </p>
            </div>
            
            <div className="about-card">
              <h4>🤝 Community Focused</h4>
              <p>
                As a local business, we're committed to supporting our community 
                and creating a welcoming space for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
