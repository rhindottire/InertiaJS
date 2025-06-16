import Jumbotron from "@/components/layouts/jumbotron";
import CustomerReview from "@/components/layouts/review";
import AppTemplate from "@/components/templates/app-template";
import { Link, usePage, router } from "@inertiajs/react";
// import { PageProps } from "@inertiajs/react";
import FaqLayout from "@/components/layouts/faqlayout";
import FavoriteButton from "@/components/elements/favorite-button";
import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_slug: string;
  expired_at: string;
  stock?: number;
  is_favorite?: boolean;
}

interface CustomPageProps extends PageProps {
  items: Item[];
  popularItems: Item[];
  search?: string;
  total: number;
}

const Homepage = () => {
  const { items = [], popularItems = [], search = '', total = 0 } = usePage<CustomPageProps>().props;
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp ');
  };

  const handleQuantityChange = (itemId: number, newQuantityInput: string, itemStock: number) => {
    let quantity = parseInt(newQuantityInput, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (itemStock > 0) quantity = Math.min(quantity, itemStock);
    else quantity = 1;

    setItemQuantities(prev => ({ ...prev, [itemId]: quantity }));
  };

  const handleAddToCart = (item: Item) => {
    const quantityToAdd = itemQuantities[item.id] || 1;

    if (item.stock === 0) {
      alert(`Maaf, ${item.name} sedang habis.`);
      return;
    }
    
    if (quantityToAdd > (item.stock || 0)) {
      alert(`Stok ${item.name} tidak mencukupi. Maksimal pembelian ${item.stock} unit.`);
      setItemQuantities(prev => ({ ...prev, [item.id]: item.stock! }));
      return;
    }

    router.post(route('client.cart.add'), {
      item_id: item.id,
      quantity: quantityToAdd,
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        alert(`${quantityToAdd} unit ${item.name} berhasil ditambahkan ke keranjang!`);
      },
      onError: (errors) => {
        console.error('Error adding item to cart:', errors);
        alert(`Gagal menambahkan ${item.name} ke keranjang.`);
      }
    });
  };
  // console.log('Popular Items:', popularItems);

  // console.log("Popular Items:", popularItems);
  console.log("Popular Items saat halaman pertama kali dimuat:", popularItems);
  console.log("Props dari usePage:", usePage().props);


  return (
    <AppTemplate className="bg-[#FFFFFF]">
    <Jumbotron />
  
    <div className="mx-16 mt-16 text-black">
  
      {/* ✅ Bagian Produk Populer - selalu muncul */}
      <h2 className="text-2xl font-bold mb-8">RB Store paling populer! 😋</h2>
      <div>
        {popularItems?.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
    {popularItems.map((item) => (
      <ProductCard
        key={item.id}
        item={item}
        onAddToCart={handleAddToCart}
      />
    ))}
  </div>
) : (
  <p className="text-gray-500">Tidak ada produk populer.</p>
)}
      </div>
      {search && (
        <div id="search-results" className="mt-12 text-black">
          <h2 className="text-2xl font-bold mb-6">
            Hasil pencarian untuk "{search}" ({total} hasil)
          </h2>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <EmptySearchResult search={search} />
          )}
        </div>
      )}
    </div>
  
    <FaqLayout />
  
    <div className="mx-16 mt-12 bg-[#51793E] rounded-2xl p-8 text-white">
      <div className="grid grid-cols-2 gap-8 text-center">
        <div>
          <h3 className="text-4xl font-bold">79,900+</h3>
          <p className="text-lg">ulasan positif</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold">1,457+</h3>
          <p className="text-lg">pesanan per hari</p>
        </div>
      </div>
    </div>
  </AppTemplate>
  
  );
};

// ✅ ProductCard fix: terima prop `onAddToCart`
const ProductCard = ({
  item,
  onAddToCart
}: {
  item: Item,
  onAddToCart: (item: Item) => void
}) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    {item.image_url ? (
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/img/placeholder.png';
        }}
      />
    ) : (
      <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center">
        <span className="text-gray-400">Tidak ada gambar</span>
      </div>
    )}

    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <FavoriteButton
          itemId={item.id}
          initialState={item.is_favorite}
          className="relative top-0 right-0 bg-transparent hover:bg-gray-100"
        />
      </div>
      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[#51793E] font-bold text-lg">
          Rp {item.price?.toLocaleString('id-ID')}
        </span>
        <button
          onClick={() => onAddToCart(item)}
          aria-label={`Tambah ${item.name} ke keranjang`}
          title={`Tambah ${item.name} ke keranjang`}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const EmptySearchResult = ({ search }: { search: string }) => (
  <div className="text-center py-12 bg-gray-50 rounded-xl">
    <p className="text-gray-500">Tidak ada hasil untuk pencarian "{search}"</p>
    <Link
      href="/"
      className="inline-block mt-4 px-6 py-2 bg-[#51793E] text-white 
               rounded-full text-sm hover:bg-[#3f5e30] transition-colors"
    >
      Cari Lagi
    </Link>
  </div>
);

export default Homepage;
