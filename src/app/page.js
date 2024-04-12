"use client";

import { useRouter } from 'next/navigation'


import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {

  const { push } = useRouter();
  push(`/usersList`)

  return (
    <main className={'sss'}>
      <table className="">
      <thead>
        <tr>
          <th>#</th>
          <th>Heading</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Text</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>#</th>
          <th>Heading</th>
        </tr>
      </tfoot>
      </table>
      
    </main>
  );
}
