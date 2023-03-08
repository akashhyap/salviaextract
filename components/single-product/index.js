import React, { useState, useEffect } from "react";
import AddToCart from "../cart/add-to-cart";
// import ExternalLink from '../products/external-link';
// import ProductGallery from './product-gallery';
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

const SingleProduct = ({ product, productVariations }) => {
  const [selectedVariationId, setSelectedVariationId] = useState();
  const [selectedVariation, setSelectedVariation] = useState();

  const handleVariationChange = (event) => {
    const selectedId = parseInt(event.target.value);
    setSelectedVariationId(selectedId);
    const variation = productVariations
      .flatMap((variationGroup) => variationGroup.variations)
      .find((variation) => {
        console.log("variation ID:", variation.id, typeof variation.id);
        console.log("selected ID:", selectedId, typeof selectedId);
        return variation.id === selectedId;
      });

    setSelectedVariation(variation);

    console.log("Selected Id:", selectedId);
    console.log("Selected variation:", variation);
  };

  return (
    <div className="single-product pt-10">
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-10">
        <div className="product-images">
          {product.images.length > 1 ? (
            "Gallery"
          ) : (
            <figure className="relative pt-[85%] border border-gray-300 rounded-lg">
              <Image
                src={product?.images?.[0]?.src ?? ""}
                alt="Image product"
                fill
                sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              />
            </figure>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product?.price_html ?? ""),
            }}
            className="product-price mb-5 text-xl"
          />
          {"variable" === product?.type ? (
            <>
              <div className="variation-select">
                <label htmlFor="variation">Size:</label>
                <select
                  value={selectedVariationId}
                  onChange={handleVariationChange}
                  className="border rounded-sm p-1 ml-2"
                >
                  {productVariations
                    .flatMap((variationGroup) => variationGroup.variations)
                    .map((variation) => (
                      <option key={variation.id} value={variation.id}>
                        {variation.attributes[0].option}
                      </option>
                    ))}
                </select>
              </div>

              <p className="price mt-2 text-2xl">
                {selectedVariation ? `$${selectedVariation.price}` : ""}
              </p>
            </>
          ) : null}

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.short_description),
            }}
            className="product-description my-5 [&>p]:text-lg [&>p]:py-4 [&>p]:leading-8 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:leading-8 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:leading-8"
          />
          {"simple" === product?.type ? <AddToCart product={product} /> : null}
        </div>
      </div>
      <div className="flex max-w-6xl mx-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description),
          }}
          className="product-description mb-5 [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:py-4 [&>p]:text-lg [&>p]:py-4 [&>p]:leading-8 [&>h3]:text-2xl [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:leading-8 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:leading-8"
        />
      </div>
    </div>
  );
};

export default SingleProduct;
