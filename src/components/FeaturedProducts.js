import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PreviewProducts from './PreviewProducts.js';

export default function FeaturedProducts(){
	//an empty array
	const [ previews, setPreviews ] = useState([]);

	useEffect(()=>{

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
		.then(res=>res.json())
		.then(data=>{
			// console.log(data)
			const numbers = []
			const featured = []

			 const generateRandomNums = () => {
                let randomNum = Math.floor(Math.random() * data.length)

                if(numbers.indexOf(randomNum) === -1){
                    numbers.push(randomNum)
                }else{
                    generateRandomNums()
                }
            }

            for(let i = 0; i < 5; i++){
            	 generateRandomNums()

            	 featured.push(
            	 	<PreviewProducts data={data[numbers[i]]} key={data[numbers[i]]} breakPoint={2} />
            	 )

            }
            	setPreviews(featured)
		})

	},[])


	return(

		<>
			<h2 className="text-center">Featured Products</h2>
			<CardGroup className="justify-content-center">
				
				{previews}

			</CardGroup>

		</>

	)
}