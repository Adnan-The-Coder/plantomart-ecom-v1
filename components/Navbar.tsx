/* eslint-disable no-unused-vars */
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import { useEffect, useState } from 'react';
import { ShoppingCart, User, Search, Truck, Heart, X, Menu, ChevronDown, ChevronRight, Phone, Minus, Plus } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

// Define types for our products and cart/wishlist items
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  tag: string;
  numericPrice: number;
}

interface CartItem extends Product {
  quantity: number;
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileVendorOpen, setIsMobileVendorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Initialize state from localStorage on component mount
  useEffect(() => {
    setIsClient(true);
    loadCartAndWishlist();

    // Add event listeners for cart and wishlist updates
    window.addEventListener('cartUpdated', loadCartAndWishlist);
    window.addEventListener('wishlistUpdated', loadCartAndWishlist);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCartAndWishlist);
      window.removeEventListener('wishlistUpdated', loadCartAndWishlist);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle localStorage changes from other tabs/windows
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'plantomartCart' || event.key === 'plantomartWishlist') {
      loadCartAndWishlist();
    }
  };

  // Load cart and wishlist data from localStorage
  const loadCartAndWishlist = () => {
    const storedCart = localStorage.getItem('plantomartCart');
    const storedWishlist = localStorage.getItem('plantomartWishlist');
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart data:", e);
        setCartItems([]);
      }
    }
    
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist data:", e);
        setWishlistItems([]);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scrolling when drawer is open
    if (isCartOpen || isWishlistOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, isWishlistOpen, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      // Close other drawers when closing menu
      setIsCartOpen(false);
      setIsWishlistOpen(false);
    }
  };

  const toggleMobileVendor = () => {
    setIsMobileVendorOpen(!isMobileVendorOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isWishlistOpen) setIsWishlistOpen(false);
    // Close menu when opening cart
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
    if (isCartOpen) setIsCartOpen(false);
    // Close menu when opening wishlist
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const closeDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsMenuOpen(false);
  };

  // Helper function to display cart/wishlist count
  const displayCount = (count: number) => {
    if (count > 5) return "5+";
    
return count.toString(); 
  };

  // Calculate cart subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('plantomartCart', JSON.stringify(updatedCart));
    
    // Dispatch event for other components
    const event = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(event);
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    
    setCartItems(updatedCart);
    localStorage.setItem('plantomartCart', JSON.stringify(updatedCart));
    
    // Dispatch event for other components
    const event = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(event);
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    
    setWishlistItems(updatedWishlist);
    localStorage.setItem('plantomartWishlist', JSON.stringify(updatedWishlist));
    
    // Dispatch event for other components
    const event = new CustomEvent('wishlistUpdated', { detail: updatedWishlist });
    window.dispatchEvent(event);
  };

  // Add wishlist item to cart
  const addWishlistItemToCart = (product: Product) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      // Increase quantity if already in cart
      updatedCart = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Add new item with quantity 1
      const newItem: CartItem = { ...product, quantity: 1 };
      updatedCart = [...cartItems, newItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('plantomartCart', JSON.stringify(updatedCart));
    
    // Dispatch event for other components
    const event = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(event);
  };
  
  return (
    <>
      <nav className={`fixed z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white py-2 shadow-md' : 'bg-white py-2'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Left side */}
            <div className="flex items-center lg:hidden">
              <button 
                className="text-gray-700 hover:text-green-600" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <Menu className="size-6" />
              </button>
            </div>
            {/* Logo - Desktop Left aligned, Mobile centered */}
            <div className="flex flex-1 items-center justify-center lg:justify-start">
              <Link href="/" className="flex items-center">
                <div className="relative size-12">
                  <Image 
                    src="/assets/logo_Without_Text.png" 
                    alt="Plantomart Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-green-800 md:text-xl lg:ml-2 lg:text-2xl">plantomart</span>
              </Link>
            </div>
            {/* Desktop Navigation - Hidden on mobile - ADJUSTED POSITIONING */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:space-x-6">
              {/* Vendors Dropdown - FIXED DROPDOWN POSITIONING */}
              <div className="group relative">
                <Link href="#" className="flex items-center text-gray-700 hover:text-green-600">
                  Vendors
                  <ChevronDown className="ml-1 size-4" />
                </Link>
                {/* Vendors Dropdown Menu - FIXED GAP AND POSITION */}
                <div className="absolute left-1/2 top-full z-50 mt-0 hidden w-screen max-w-5xl -translate-x-1/2 transform rounded-xl border border-gray-200 bg-white p-6 shadow-2xl group-hover:block">
                  {/* Added invisible padding bridge to prevent hover loss */}
                  <div className="absolute -top-4 left-0 h-4 w-full"></div>
                  <div className="flex w-full gap-10">
                    {/* Vendor List Column */}
                    <div className="w-1/3 border-r border-gray-100 pr-6">
                      <h3 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Vendors</h3>
                      <ul className="space-y-3">
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Show Bageecha</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Super Saaf</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Leaf Grid</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Plantify</Link></li>
                        <li><Link href="#" className="cursor-not-allowed text-gray-400">Surface Gauge <span className="text-xs italic text-gray-300">(Coming soon)</span></Link></li>
                      </ul>
                    </div>
                    {/* Product Column */}
                    <div className="w-1/3 border-r border-gray-100 pr-6">
                      <h3 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Product Features</h3>
                      <ul className="space-y-3">
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Product Sidebar</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Bought Together</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Product Countdown</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Grouped Product</Link></li>
                      </ul>
                    </div>
                    {/* Promo Banner */}
                    <div className="w-1/3">
                      <div className="relative h-52 w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-green-100 via-white to-green-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
                        <div className="absolute inset-0 bg-[url('/api/placeholder/500/300')] bg-cover bg-center opacity-20"></div>
                        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-green-900">
                          <h3 className="mb-1 text-2xl font-bold">25% OFF</h3>
                          <p className="text-sm font-medium">Shop at Plant-O-Mart</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="#" className="text-gray-700 hover:text-green-600">Menu</Link>
              <Link href="#" className="text-gray-700 hover:text-green-600">About</Link>
              <div className="group relative">
                <Link href="#" className="flex items-center text-gray-700 hover:text-green-600">
                  Blog
                  <ChevronDown className="ml-1 size-4" />
                </Link>
                {/* Added dropdown container for Blog dropdown */}
                <div className="absolute left-0 top-full z-50 mt-0 hidden w-48 rounded-lg border border-gray-200 bg-white p-4 shadow-xl group-hover:block">
                  {/* Added invisible padding bridge to prevent hover loss */}
                  <div className="absolute -top-4 left-0 h-4 w-full"></div>
                  <ul className="space-y-2">
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">Blog Grid</Link></li>
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">Blog List</Link></li>
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">Blog Details</Link></li>
                  </ul>
                </div>
              </div>
              <div className="group relative">
                <Link href="#" className="flex items-center text-gray-700 hover:text-green-600">
                  Page
                  <ChevronDown className="ml-1 size-4" />
                </Link>
                {/* Added dropdown container for Page dropdown */}
                <div className="absolute left-0 top-full z-50 mt-0 hidden w-48 rounded-lg border border-gray-200 bg-white p-4 shadow-xl group-hover:block">
                  {/* Added invisible padding bridge to prevent hover loss */}
                  <div className="absolute -top-4 left-0 h-4 w-full"></div>
                  <ul className="space-y-2">
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">About Us</Link></li>
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">FAQ</Link></li>
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">Contact</Link></li>
                    <li><Link href="#" className="block text-gray-700 hover:text-green-600">404 Page</Link></li>
                  </ul>
                </div>
              </div>
              <Link href="#" className="text-gray-700 hover:text-green-600">Contact</Link>
            </div>
            {/* Desktop Actions Container - Added more separation from menu */}
            <div className="hidden items-center lg:flex lg:space-x-8">
              {/* Delivery Info - Now with more space from action icons */}
              <div className="flex items-center text-green-600">
                <div className="relative mr-3 flex size-10 items-center justify-center rounded-full bg-green-100 p-2">
                  <Truck className="size-5 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Reach Out At</span>
                  <span className="font-bold text-black">+91 833 180 1000</span>
                </div>
              </div>
              {/* Action Icons - With divider for visual separation */}
              <div className="flex items-center space-x-5 border-l border-gray-200 pl-6">
                <button className="text-gray-700 hover:text-green-600">
                  <Search className="size-5" />
                </button>
                <button className="text-gray-700 hover:text-green-600">
                  <User className="size-5" />
                </button>
                <div className="relative">
                  <button 
                    className="text-gray-700 hover:text-green-600"
                    onClick={toggleCart}
                    aria-label="Cart"
                  >
                    {cartItems.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                        {displayCount(cartItems.length)}
                    </span>
                    )}
                    <ShoppingCart className="size-5" />
                  </button>
                </div>
                <div className="relative">
                  <button 
                    className="text-gray-700 hover:text-green-600"
                    onClick={toggleWishlist}
                    aria-label="Wishlist"
                  >
                    {wishlistItems.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                        {displayCount(wishlistItems.length)}
                    </span>
                    )}
                    <Heart className="size-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile Right Actions */}
            <div className="flex items-center space-x-4 lg:hidden">
              {/* Phone icon - matches reference image */}
              <Link href="tel:+918331801000" className="relative text-gray-700 hover:text-green-600">
                <Phone className="size-5" />
              </Link>
              {/* Shopping Cart */}
              <button 
                className="relative text-gray-700 hover:text-green-600"
                onClick={toggleCart}
                aria-label="Cart"
              >
                {cartItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                    {displayCount(cartItems.length)}
                </span>
                )}
                <ShoppingCart className="size-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu - UPDATED with better header and UX */}
        {isMenuOpen && (
          <>
            {/* Overlay that covers the rest of the screen */}
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
              onClick={toggleMenu}
            ></div>
            {/* Side drawer menu that slides in from the left with improved header */}
            <div className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm overflow-hidden bg-white shadow-xl transition-transform lg:hidden">
              {/* Menu Header with close button */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-green-50 px-4 py-3">
                <div className="flex items-center">
                  <div className="relative mr-2 size-8">
                    <Image 
                      src="/assets/logo_Without_Text.png" 
                      alt="Plantomart Logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold text-green-800">plantomart</span>
                </div>
                <button 
                  onClick={toggleMenu}
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="size-6" />
                </button>
              </div>
              {/* Menu content with scrollable area */}
              <div className="h-[calc(100%-56px)] overflow-y-auto">
                <div className="p-4">
                  <div className="flex flex-col space-y-4">
                    {/* Search bar with improved styling */}
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <Search className="mr-2 size-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="flex-1 bg-transparent text-gray-700 outline-none"
                      />
                    </div>
                    {/* Account shortcuts with improved visual design */}
                    <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-3">
                      <Link href="/account" className="flex items-center rounded-md bg-white p-2 text-gray-700 shadow-sm transition-all hover:bg-green-50 hover:text-green-600">
                        <User className="mr-2 size-4" />
                        <span>Account</span>
                      </Link>
                      <Link href="/wishlist" className="flex items-center rounded-md bg-white p-2 text-gray-700 shadow-sm transition-all hover:bg-green-50 hover:text-green-600">
                        <Heart className="mr-2 size-4" />
                        <span>Wishlist</span>
                        {wishlistItems.length > 0 && (
                          <span className="ml-1 rounded-full bg-yellow-500 px-1.5 text-xs text-white">
                            {displayCount(wishlistItems.length)}
                          </span>
                        )}
                      </Link>
                      <Link href="/cart" className="flex items-center rounded-md bg-white p-2 text-gray-700 shadow-sm transition-all hover:bg-green-50 hover:text-green-600">
                        <ShoppingCart className="mr-2 size-4" />
                        <span>Cart</span>
                        {cartItems.length > 0 && (
                          <span className="ml-1 rounded-full bg-yellow-500 px-1.5 text-xs text-white">
                            {displayCount(cartItems.length)}
                          </span>
                        )}
                      </Link>
                    </div>
                    {/* Mobile navigation items with improved visual feedback */}
                    <div className="mt-2">
                      {/* Mobile Vendors Dropdown with animation */}
                      <div>
                        <button 
                          onClick={toggleMobileVendor}
                          className="flex w-full items-center justify-between border-b border-gray-100 py-3 text-gray-700 transition-colors hover:text-green-600"
                        >
                          <span className="font-medium">Vendors</span>
                          <ChevronRight 
                            className={`size-4 transition-transform duration-300 ${isMobileVendorOpen ? 'rotate-90' : ''}`} 
                          />
                        </button>
                        {/* Mobile Vendors Submenu with smooth animation */}
                        {isMobileVendorOpen && (
                          <div className="mt-2 overflow-hidden pl-4">
                            <div className="mb-4">
                              <h3 className="mb-2 text-sm font-medium uppercase text-gray-500">VENDOR LIST</h3>
                              <ul className="space-y-2 pl-2">
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Show Bageecha</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Super Saaf</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Leaf Grid</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Plantify</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Surface Gauge <span className="text-xs italic text-gray-400">(Coming soon)</span></Link></li>
                              </ul>
                            </div>
                            <div className="mb-4">
                              <h3 className="mb-2 text-sm font-medium uppercase text-gray-500">PRODUCT</h3>
                              <ul className="space-y-2 pl-2">
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Product Sidebar</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Bought Together</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Product Countdown</Link></li>
                                <li><Link href="#" className="block py-1 text-gray-800 transition-colors hover:text-green-600">Grouped Product</Link></li>
                              </ul>
                            </div>
                            {/* Promotional banner with improved visual appeal */}
                            <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg">
                              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800"></div>
                              <div className="absolute inset-0 bg-[url('/api/placeholder/500/300')] bg-cover bg-center opacity-20"></div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                                <h3 className="mb-1 text-2xl font-bold">25% OFF</h3>
                                <p className="text-base font-medium">Shop Plant-O-Mart today</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Other menu items with improved hover effects */}
                      <Link href="#" className="block border-b border-gray-100 py-3 font-medium text-gray-700 transition-colors hover:text-green-600">Menu</Link>
                      <Link href="#" className="block border-b border-gray-100 py-3 font-medium text-gray-700 transition-colors hover:text-green-600">About</Link>
                      {/* Blog dropdown with improved visual feedback */}
                      <button 
                        className="flex w-full items-center justify-between border-b border-gray-100 py-3 font-medium text-gray-700 transition-colors hover:text-green-600"
                        onClick={() => {/* Toggle blog submenu */}}
                      >
                        Blog
                        <ChevronRight className="size-4" />
                      </button>
                      {/* Page dropdown with improved visual feedback */}
                      <button 
                        className="flex w-full items-center justify-between border-b border-gray-100 py-3 font-medium text-gray-700 transition-colors hover:text-green-600"
                        onClick={() => {/* Toggle page submenu */}}
                      >
                        Page
                        <ChevronRight className="size-4" />
                      </button>
                      <Link href="#" className="block border-b border-gray-100 py-3 font-medium text-gray-700 transition-colors hover:text-green-600">Contact</Link>
                      {/* Mobile Contact Info with improved visual design */}
                      <div className="mt-6 rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4">
                        <div className="flex items-center">
                          <div className="mr-3 flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                            <Phone className="size-5 text-green-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Reach Out At</span>
                            <Link href="tel:+918331801000" className="font-bold text-black hover:underline">+91 833 180 1000</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
            onClick={closeDrawers}
          ></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl transition-transform sm:max-w-lg">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-800">Shopping Cart ({cartItems.length})</h2>
              <button 
                onClick={closeDrawers}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>
            {cartItems.length > 0 ? (
              <div className="mt-6">
                {/* Dynamically generated cart items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="mb-4 flex items-center border-b border-gray-100 pb-4">
                    <div className="relative mr-4 size-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-green-600">{item.price}</p>
                      <div className="mt-2 flex items-center">
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="flex size-6 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="mx-2 w-8 text-center text-sm text-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="flex size-6 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-base font-medium text-gray-600">Subtotal</span>
                    <span className="text-base font-medium text-gray-900">₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/cart"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      onClick={closeDrawers}
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      className="rounded-md bg-green-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-green-700"
                      onClick={closeDrawers}
                    >
                      Checkout
                    </Link>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <button
                      type="button"
                      className="font-medium text-green-600 hover:text-green-500"
                      onClick={closeDrawers}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-16 flex flex-col items-center justify-center">
                <ShoppingCart className="size-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    onClick={closeDrawers}
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {/* Wishlist Drawer */}
      {isWishlistOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
            onClick={closeDrawers}
          ></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl transition-transform sm:max-w-lg">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-800">Wishlist ({wishlistItems.length})</h2>
              <button 
                onClick={closeDrawers}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>
            {wishlistItems.length > 0 ? (
              <div className="mt-6">
                {/* Dynamically generated wishlist items */}
                {wishlistItems.map((item, index) => (
                  <div key={item.id} className="mb-4 flex items-center border-b border-gray-100 pb-4">
                    <div className="relative mr-4 size-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-green-600">{item.price}</p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <button 
                        className="rounded-md bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                        onClick={() => addWishlistItemToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6">
                  <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                    <button
                      type="button"
                      className="font-medium text-green-600 hover:text-green-500"
                      onClick={closeDrawers}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-16 flex flex-col items-center justify-center">
                <Heart className="size-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                <p className="mt-1 text-gray-500">Save your favorite plants for later!</p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    onClick={closeDrawers}
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;