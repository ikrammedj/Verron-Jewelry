'use client'
import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from '@material-tailwind/react';
import Link from 'next/link';

const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    return false;
};

const Card2 = ({
    id,
    image,
    name,
    price,
    description
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleMouseEnter = () => {
        if (!isEmpty(image) && image.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % image.length);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImageIndex(0);
    };

    return (
        <Card
            className="w-full max-w-96 h-[32rem] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col transform hover:-translate-y-2 transition-transform duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <CardHeader shadow={false} floated={false} className="h-48 m-0 mt-4 mx-4 rounded-lg overflow-hidden">
                <img
                    src={!isEmpty(image) ? image[currentImageIndex] : "https://i.ibb.co/B25x5CSK/bijoux.jpg"}
                    alt={!isEmpty(name) ? name : "Produit inconnu"}
                    className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
                    onError={(e) => { e.target.src = "https://i.ibb.co/B25x5CSK/bijoux.jpg"; }}
                />
            </CardHeader>

            <CardBody className="p-4 h-32 flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <Typography className="font-semibold text-lg text-gray-900">
                        {!isEmpty(name) ? name : "Produit inconnu"}
                    </Typography>
                    <Typography className="font-semibold text-lg text-gray-900 whitespace-nowrap">
                        {!isEmpty(price) ? `${price} DA` : "Prix indisponible"}
                    </Typography>
                </div>
                <Typography variant="small" color="gray" className="opacity-80 line-clamp-2 text-gray-700">
                    {!isEmpty(description) ? description : "Aucune description disponible."}
                </Typography>
            </CardBody>

            <CardFooter className="p-4 mt-auto">
                <Link href={`/products/${id}`}>
                    <Button
                        ripple={false}
                        fullWidth={true}
                        className="bg-amber-400 text-white shadow-md hover:bg-amber-600 transition-all transform hover:scale-105 duration-300 rounded-lg py-3"
                    >
                        Acheter
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default Card2;