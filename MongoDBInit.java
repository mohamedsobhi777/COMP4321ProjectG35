
import java.util.Arrays;
import org.bson.Document;
import org.bson.types.ObjectId;
import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;

public class MongoDBInit {
    public static void main( String[] args ) {
        // Replace the placeholder with your MongoDB deployment's connection string
        String uri = "mongodb+srv://chhuiwork:COMP4321haha@cluster0.mncnodn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        try (MongoClient mongoClient = MongoClients.create(uri)) {
            MongoDatabase database = mongoClient.getDatabase("COMP4321");
            MongoCollection<Document> pageInfo = database.getCollection("pageInfo");
            MongoCollection<Document> wordList = database.getCollection("wordList");
            MongoCollection<Document> forwardTable = database.getCollection("forwardTable");
            MongoCollection<Document> invertedTableBody = database.getCollection("invertedTableBody");
            MongoCollection<Document> invertedTableTitle = database.getCollection("invertedTableTitle");
            System.out.println("Database is connected successfully");
            try{
                InsertOneResult result = pageInfo.insertOne(new Document()
                        .append("_id", new ObjectId())
                        .append("title", "haha"));
            }catch (MongoException me) {
            System.err.println("Unable to insert due to an error: " + me);
            }
        }
        catch (Exception e){
            System.err.println(e.getClass().getName()+ ": " + e.getMessage());
        }


    }
}