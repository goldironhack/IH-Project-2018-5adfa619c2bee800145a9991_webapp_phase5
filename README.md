## webapp_phase5

1. App Name: Finder
2. Keywords: Safety, Nearest, Extreme low income, districts
3. Datasets: Crimes, housing, neighborhoods, geoshapes
   Functions: 
   - initMap: In this function i load the geoshapes in the dataset of geoshapes and I save the polygons of the districts in an array called 'districts' and too I calculate the center of the district to use it in the function of nearest, I save the centers in an array called 'disCenter'.
   
   - Safety: To get a value of safety I designed the function getSafety that uses the Crimes dataset, then I take the location of the Crime and then I compare if that location is into the polygons that the dataset of geoshapes gives me. I use the array of disCrimes to save the position of the district in the array where I save the polygons. Then I use an ordering algorithm to order those positions and the select th etop 10.This function can take some seconds calculating the top 10.
   
   - Nearest: In this function I take the center of the districts and I calculate the spherical distances between the center and the university. To save theorder of the districts I use an array called 'disNear'.
   
   - ExtremeLowIncome: In this function I calculate the number of habitable houses in the districts and like in the safety function I count those houses and y order the districts. This function can take some seconds calculating the top 10.
   
   - getNHooNames: In this function I put in a table information about the dataset of neighborhoods.
   
