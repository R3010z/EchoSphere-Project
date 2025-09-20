import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUserWithPost(email, name, postTitle, postContent) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        posts: {
          create: { title: postTitle, content: postContent },
        },
      },
      include: { posts: true },
    });
    console.log('Utilisateur créé avec post:', user);
    return user;
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    throw error;
  }
}

async function getAllUsersWithPosts() {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Liste utilisateurs:', users);
    return users;
  } catch (error) {
    console.error('Erreur lecture utilisateurs:', error);
    throw error;
  }
}

async function updatePostContent(postId, newContent) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content: newContent },
    });
    console.log('Post mis à jour:', updatedPost);
    return updatedPost;
  } catch (error) {
    console.error('Erreur mise à jour post:', error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    console.log('Utilisateur supprimé:', userId);
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    throw error;
  }
}

async function main() {
  // Exemple d'utilisation des fonctions
  const user = await createUserWithPost(
    'alice@example.com',
    'Alice',
    'Bienvenue',
    'Premier post'
  );

  const users = await getAllUsersWithPosts();

  if (users.length > 0 && users[0].posts.length > 0) {
    await updatePostContent(users[0].posts[0].id, 'Contenu mis à jour');
  }

  // Supprimer l'utilisateur créé pour nettoyage
  await deleteUser(user.id);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
