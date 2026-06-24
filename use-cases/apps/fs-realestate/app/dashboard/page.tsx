"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Home, 
  TrendingUp, 
  Camera, 
  MessageSquare,
  Settings,
  Edit2,
  Trash2
} from "lucide-react";
import { useAuthStore, useAuthHasHydrated } from "@/store/authStore";
import { useListingStore } from "@/store/listingStore";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const authHydrated = useAuthHasHydrated();
  const { user, isAuthenticated } = useAuthStore();
  const listings = useListingStore((state) => state.listings);
  const removeListing = useListingStore((state) => state.removeListing);

  const userListings = listings.filter((l) => l.ownerId === user?.id);

  useEffect(() => {
    if (authHydrated && !isAuthenticated) {
      router.push("/");
    }
  }, [authHydrated, isAuthenticated, router]);

  if (!authHydrated || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 space-y-1">
            <h2 className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Main Menu
            </h2>
            <nav className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl text-rose-600 font-bold shadow-sm">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link href="/listings/new" className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-white hover:text-rose-600 rounded-xl transition-all">
                <PlusCircle className="h-5 w-5" />
                New Listing
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-white hover:text-rose-600 rounded-xl transition-all">
                <MessageSquare className="h-5 w-5" />
                Messages
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-white hover:text-rose-600 rounded-xl transition-all">
                <Settings className="h-5 w-5" />
                Settings
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-slate-500 mt-1">Manage your properties and see how they perform.</p>
              </div>
              <Link 
                href="/listings/new" 
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 h-12"
              >
                <PlusCircle className="h-5 w-5" />
                Post a Property
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                    <Home className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total</span>
                </div>
                <p className="text-3xl font-black text-slate-900">{userListings.length}</p>
                <p className="text-sm font-bold text-slate-500">Your Active Listings</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reach</span>
                </div>
                <p className="text-3xl font-black text-slate-900">1.2k</p>
                <p className="text-sm font-bold text-slate-500">Total Views This Week</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Camera className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Quality</span>
                </div>
                <p className="text-3xl font-black text-slate-900">8.4</p>
                <p className="text-sm font-bold text-slate-500">Avg. Listing Score</p>
              </div>
            </div>

            {/* My Listings */}
            <section className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Your Property Portfolio</h2>
              
              {userListings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Home className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No properties yet</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                    Start by posting your first property to see it appear here in your dashboard.
                  </p>
                  <Link href="/listings/new" className="btn-primary mt-6 inline-flex px-8">
                    Create your first listing
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                      <div className="flex h-32">
                        <div className="w-40 shrink-0">
                          <img 
                            src={listing.images[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"} 
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 line-clamp-1">{listing.title}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{listing.city}, {listing.state}</p>
                            <p className="text-sm font-black text-rose-600 mt-1">{formatPrice(listing.price)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-1">
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </button>
                            <button 
                              onClick={() => removeListing(listing.id)}
                              className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <Link href={`/listings/${listing.id}`} className="absolute inset-0 z-0" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Inspiration / Tips */}
            <section className="bg-[#001e44] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <h2 className="text-2xl font-black mb-4">Listing Inspiration & Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-400">
                      <div className="h-6 w-6 rounded-full bg-rose-400/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-rose-400">01</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Photography</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Listings with 10+ high-quality photos receive 60% more engagement. Use Filestack to ensure fast delivery.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="h-6 w-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-emerald-400">02</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Description</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Highlight unique features like &quot;floor-to-ceiling windows&quot; or &quot;smart home integration&quot; to stand out.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-400">03</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Pricing</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Check similar properties in your city ({userListings[0]?.city || 'Toronto'}) to ensure your pricing is competitive.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <div className="h-6 w-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-amber-400">04</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Trust</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Ensure your contact information is up to date in settings to build buyer confidence.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
              <Home className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 rotate-12 pointer-events-none" />
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
