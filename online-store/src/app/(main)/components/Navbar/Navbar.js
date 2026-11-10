"use client";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";
import TabletNavbar from "./TabletNavbar";

export default function Navbar() {
    return (
        <>
            <DesktopNavbar />
            <TabletNavbar />
            <MobileNavbar />
        </>
    );
}
