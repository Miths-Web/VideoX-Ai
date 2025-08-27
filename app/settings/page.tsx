"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Download, 
  Save, 
  Trash2, 
  LogOut,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { currentUser, logout, updateUserProfile, updateUserEmail, updateUserPassword, getUserData, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile settings
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [processingAlerts, setProcessingAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Enhancement preferences
  const [defaultResolution, setDefaultResolution] = useState("4k");
  const [defaultFps, setDefaultFps] = useState("60");
  const [autoEnhanceColors, setAutoEnhanceColors] = useState(true);
  const [autoDenoising, setAutoDenoising] = useState(true);
  const [autoStabilization, setAutoStabilization] = useState(false);
  
  // Storage settings
  const [autoDownload, setAutoDownload] = useState(false);
  const [deleteAfterDownload, setDeleteAfterDownload] = useState(false);
  
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        
        // Set basic profile info from auth
        setName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        
        // Get additional user data from Firestore
        const userData = await getUserData();
        
        if (userData) {
          // Set notification preferences
          setEmailNotifications(userData.notifications?.email ?? true);
          setProcessingAlerts(userData.notifications?.processing ?? true);
          setMarketingEmails(userData.notifications?.marketing ?? false);
          
          // Set enhancement preferences
          setDefaultResolution(userData.preferences?.defaultResolution ?? "4k");
          setDefaultFps(userData.preferences?.defaultFps ?? "60");
          setAutoEnhanceColors(userData.preferences?.autoEnhanceColors ?? true);
          setAutoDenoising(userData.preferences?.autoDenoising ?? true);
          setAutoStabilization(userData.preferences?.autoStabilization ?? false);
          
          // Set storage settings
          setAutoDownload(userData.storage?.autoDownload ?? false);
          setDeleteAfterDownload(userData.storage?.deleteAfterDownload ?? false);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user settings");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser, getUserData]);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update display name if changed
      if (currentUser && name !== currentUser.displayName) {
        await updateUserProfile(name);
      }
      
      // Update email if changed
      if (currentUser && email !== currentUser.email) {
        await updateUserEmail(email);
      }
      
      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        
        await updateUserPassword(newPassword);
      }
      
      toast.success("Profile settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };
  
  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    try {
      await updateUserData({
        preferences: {
          defaultResolution,
          defaultFps,
          autoEnhanceColors,
          autoDenoising,
          autoStabilization
        }
      });
      
      toast.success("Enhancement preferences updated!");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    
    try {
      await updateUserData({
        notifications: {
          email: emailNotifications,
          processing: processingAlerts,
          marketing: marketingEmails
        }
      });
      
      toast.success("Notification preferences updated!");
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveStorage = async () => {
    setIsLoading(true);
    
    try {
      await updateUserData({
        storage: {
          autoDownload,
          deleteAfterDownload
        }
      });
      
      toast.success("Storage settings updated!");
    } catch (error) {
      toast.error("Failed to update storage settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    toast("Account deletion", {
      description: "This action cannot be undone. Please contact support to delete your account.",
    });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Settings</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to access settings</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how it appears on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="your.email@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      This email will be used for account notifications and recovery
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Preferences</CardTitle>
              <CardDescription>
                Configure your default settings for video enhancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-resolution">Default Resolution</Label>
                <Select value={defaultResolution} onValueChange={setDefaultResolution}>
                  <SelectTrigger id="default-resolution">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hd">HD (1080p)</SelectItem>
                    <SelectItem value="2k">2K (1440p)</SelectItem>
                    <SelectItem value="4k">4K (2160p)</SelectItem>
                    <SelectItem value="8k">8K (4320p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-fps">Default Frame Rate</Label>
                <Select value={defaultFps} onValueChange={setDefaultFps}>
                  <SelectTrigger id="default-fps">
                    <SelectValue placeholder="Select frame rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 FPS (Film)</SelectItem>
                    <SelectItem value="30">30 FPS (Standard)</SelectItem>
                    <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                    <SelectItem value="120">120 FPS (Ultra Smooth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Enhancement Options</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-color">Auto Color Enhancement</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically improve color vibrancy and contrast
                    </p>
                  </div>
                  <Switch
                    id="auto-color"
                    checked={autoEnhanceColors}
                    onCheckedChange={setAutoEnhanceColors}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-denoise">Auto Noise Reduction</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically remove grain and digital noise
                    </p>
                  </div>
                  <Switch
                    id="auto-denoise"
                    checked={autoDenoising}
                    onCheckedChange={setAutoDenoising}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-stabilize">Auto Video Stabilization</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reduce camera shake and jitter
                    </p>
                  </div>
                  <Switch
                    id="auto-stabilize"
                    checked={autoStabilization}
                    onCheckedChange={setAutoStabilization}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure how your enhanced videos are stored and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-download">Auto Download</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically download videos when enhancement is complete
                  </p>
                </div>
                <Switch
                  id="auto-download"
                  checked={autoDownload}
                  onCheckedChange={setAutoDownload}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="delete-after-download">Delete After Download</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delete videos from cloud storage after downloading
                  </p>
                </div>
                <Switch
                  id="delete-after-download"
                  checked={deleteAfterDownload}
                  onCheckedChange={setDeleteAfterDownload}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStorage} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Storage Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="processing-alerts">Processing Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when video processing is complete
                  </p>
                </div>
                <Switch
                  id="processing-alerts"
                  checked={processingAlerts}
                  onCheckedChange={setProcessingAlerts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">$19.99/month</p>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your next billing date is April 15, 2025
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Change Plan</Button>
                  <Button variant="outline" size="sm">Cancel Subscription</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Method</h3>
                <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="link" className="h-auto p-0 text-sm">
                  Update payment method
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Log out of all devices</h3>
                  <p className="text-xs text-muted-foreground">
                    This will log you out from all devices except this one
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Log Out All
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Export your data</h3>
                  <p className="text-xs text-muted-foreground">
                    Download a copy of your account data and videos
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-destructive">Delete account</h3>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}