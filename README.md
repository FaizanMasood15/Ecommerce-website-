# Funiro E-Commerce Website

A modern, responsive e-commerce furniture website built using **React** for the front-end logic and **Tailwind CSS** for rapid styling, based on the provided Figma design mockups. The project name has been customized to **Faizan Butt**.

## 🚀 Project Overview

The goal of this project is to accurately translate the provided 9 Figma screens (Home, Shop, Single Product, Cart, Cart Sidebar, Checkout, Product Comparison, Blog, and Contact) into a functional and responsive web application.

## 🛠️ Tech Stack

* **Frontend Framework:** React
* **Styling:** Tailwind CSS (Utility-First Framework)
* **Language:** JavaScript (ES6+)
* **Tooling:** Vite
* **Icons:** Lucide React

## 🎨 Design System Style Guide

This style guide ensures component consistency across the entire application, making development efficient with Tailwind CSS.

### 1. Color Palette

* **Primary (Accent)**
    * **Tailwind Class (Hex Code):** `bg-primary` / `text-primary` (`#B88E2F`)
    * **Usage:** Primary actions, buttons, and active states.
* **Secondary Accent**
    * **Tailwind Class (Hex Code):** `bg-secondary-accent` / `text-secondary-accent` (`#1B5E20`)
    * **Usage:** "New" product tags.
* **Neutral (Text)**
    * **Tailwind Class (Hex Code):** `text-gray-900` (`#333333`)
    * **Usage:** Main headings and body text.
* **Background**
    * **Tailwind Class (Hex Code):** `bg-background-light` (`#F4F5F7`)
    * **Usage:** Section backgrounds (e.g., Features strip).
* **Hero Box Background**
    * **Tailwind Class (Hex Code):** `bg-hero-box` (`#F9F1E7` or `#fff3e3`)
    * **Usage:** The content box in the Hero Section.

### 2. Typography

The default sans-serif font family provided by Tailwind CSS (Inter/Poppins) is used.

| Element | Weight | Tailwind Class |
| :--- | :--- | :--- |
| **Section H2** | Bold | `text-4xl font-bold` |
| **Product H3** | Semi-Bold | `text-2xl font-semibold` |
| **Body Text** | Regular | `text-base` |

## 3. Layout & Structure

* **Max Content Width:** `max-w-7xl` (1280px) centered with `mx-auto`.
* **Vertical Spacing:** Standard section separation is implemented using `py-16` or `py-20`.

***

## ⚙️ How to Continue (After Conflict Resolution)

After you save the `README.md` file with the content above, you must complete the steps that Git paused during the conflict:

1.  **Stage the resolved file:**
    ```powershell
    git add README.md
    ```
2.  **Continue the rebase:**
    ```powershell
    git rebase --continue
    ```
3.  **Final Push:**
    ```powershell
    git push -u origin main
    ```

Once these three commands run without errors, your code will be uploaded, and we can move on to the next page!