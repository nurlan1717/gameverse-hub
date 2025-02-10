import React from 'react';
import { useParams } from 'react-router-dom';
import { Rating, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useGetGamesByIdQuery } from '../../../features/games/gamesSlice';
import { useAddToBasketMutation, useAddToWishlistMutation } from '../../../features/user/usersSlice';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: game, isLoading, isError } = useGetGamesByIdQuery(id);
  const [addToWishlist] = useAddToWishlistMutation();
  const [addToBasket] = useAddToBasketMutation();

  const token = Cookies.get('token');

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (isError || !game) return <div className="text-red-400">Error loading game details.</div>;

  const handleAuthCheck = () => {
    if (!token) {
      toast.error('Please login to perform this action');
      return false;
    }
    return true;
  };

  const handleAddToWishlist = async () => {
    if (!handleAuthCheck()) return;
    try {
      await addToWishlist({ gameId: game.data._id }).unwrap();
      toast.success('Added to wishlist successfully!');
    } catch (err: any) {
      if (err.data.message === "Game already in wishlist") {
        toast.error('This game is already in your wishlist');
        return;
      }
      toast.error('Failed to add to wishlist');
    }
  };

  const handleAddToBasket = async () => {
    if (!handleAuthCheck()) return;
    try {
      await addToBasket({ gameId: game.data._id }).unwrap();
      toast.success('Added to basket successfully!');
    } catch (err: any) {
      toast.error('Failed to add to basket');
    }
  };

  const handleBuyNow = () => {
    if (!handleAuthCheck()) return;
    alert('Buy Now clicked!');
  };

  return (
    <section className="w-full py-10 bg-[#101014] text-white px-4 md:px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{game.data.title}</h1>
        <div className="flex items-center gap-4 text-gray-300">
          <span>Genre: {game.data.genre}</span>
          <span>Platform: {game.data.platform}</span>
          <Rating className='text-white' value={game.data.rating} precision={0.5} readOnly />

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          {game.data.videoTrailerUrl && (
            <iframe
              width="100%"
              height="400"
              src={game.data.videoTrailerUrl}
              title="Game Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          )}
        </div>

        <div className="bg-[#121216] rounded-lg p-6 shadow-lg">
          <img
            src={game.data.coverPhotoUrl}
            alt={game.data.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          {game.data.freeWeekly ? (
            <h3 className="text-green-500 text-xl font-bold mb-4">Free This Week!</h3>
          ) : (
            <h3 className="text-2xl font-bold mb-4">Price: ${game.data.price}</h3>
          )}
          <div className="flex flex-col gap-4">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBuyNow}
              className="bg-[#26bbff] hover:bg-[#1f9fd8]"
            >
              Buy Now
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleAddToBasket}
              className="text-[#FFF] border-[#26bbff] hover:bg-[#1f9fd8] hover:text-white"
            >
              Add to Basket
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleAddToWishlist}
              className="text-[#FFF] border-[#26bbff] hover:bg-[#1f9fd8] hover:text-white"
            >
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#121216] rounded-lg p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-4">System Requirements</h3>
            <p className="text-gray-300 mb-6">{game.data.systemRequirements}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-4">Description</h3>
            <p className="text-gray-300 mb-6">{game.data.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Created At</h3>
            <p className="text-gray-300">{new Date(game.data.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Sales</h3>
            <p className="text-gray-300">{game.data.sales} Sales</p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
      />
    </section>
  );
};

export default Details;