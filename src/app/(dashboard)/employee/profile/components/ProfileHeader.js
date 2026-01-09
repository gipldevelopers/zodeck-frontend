"use client";

import { Camera, Phone, MapPin } from 'lucide-react';

export default function ProfileHeader({ profileData }) {
    return (
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 overflow-hidden">
            <div className="relative">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800"></div>

                {/* Profile Content */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16">
                        {/* Profile Photo */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <img
                                    src="/images/users/user-01.png"
                                    alt={`${profileData.firstName} ${profileData.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                                <Camera size={16} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {profileData.firstName} {profileData.lastName}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start mt-3 gap-4">
                                {profileData.phone && (
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Phone size={16} className="mr-1" />
                                        {profileData.phone}
                                    </div>
                                )}
                                {profileData.address && (
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <MapPin size={16} className="mr-1" />
                                        {profileData.address}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
