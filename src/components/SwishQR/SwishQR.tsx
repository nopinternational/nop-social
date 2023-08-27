import Image from 'next/image'
import swishPic from './swish.png'

export const SwishQR = () => {
    return (
        <Image
            className="m-auto"
            src={swishPic}
            alt="Swish QR för träffen"
            width={400}
            height={150}
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
        />)
}